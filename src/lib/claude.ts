import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { PathwayStepRow, ProfileRow } from "@/lib/types/database";

// Model choice: claude-sonnet-5 — near-Opus quality on this kind of grounded
// narration task at a fraction of the cost, which matters given the project's
// tight AED budget. Swap to "claude-opus-4-8" here if quality issues show up
// during SME review.
const MODEL = "claude-sonnet-5";

const client = new Anthropic();

const RoadmapSection = z.object({
  stepCode: z
    .string()
    .describe("Must exactly match one of the allowed pathway step codes provided in the input — never invent a new code."),
  narrative: z
    .string()
    .describe("2-4 sentences personalizing this step for the user. Do not state any duration, fee, or requirement not present in the provided step data."),
});

const RoadmapOutput = z.object({
  statusSummary: z
    .string()
    .describe("1-2 sentence plain-language summary of where this person currently stands."),
  sections: z.array(RoadmapSection),
  closingNote: z
    .string()
    .describe("1-2 sentence encouraging next-action close. No new facts."),
});

export type RoadmapOutput = z.infer<typeof RoadmapOutput>;

export interface GenerateRoadmapInput {
  profile: ProfileRow;
  steps: PathwayStepRow[]; // already ordered + deduped by the rules engine
  gaps: string[];
  timelineWeeks: { min: number; max: number };
}

const SYSTEM_PROMPT = `You write the narrative for a UK dental career roadmap tool used by foreign-trained dentists.

You will be given a profile and a fixed, ordered list of "allowed steps" already selected by a deterministic rules engine — these are the only facts you are permitted to use. Each allowed step has a title, description, category, and a duration range that has already been verified.

Hard rules:
- Output exactly one section per allowed step, in the same order, using its exact stepCode.
- Never introduce a registration requirement, exam, fee, duration, or visa rule that is not present in the provided step data. If you want to mention a duration, only use the range already given for that step.
- Do not invent or guess at GDC/ORE/LDS/visa facts beyond what's provided, even if you believe you know them — the data given to you is the verified source of truth, not your background knowledge.
- Write in plain, encouraging, second-person language for someone who is confused and stressed about where to start.
- Keep each section to 2-4 sentences.`;

function buildUserContent(input: GenerateRoadmapInput): string {
  const { profile, steps, gaps, timelineWeeks } = input;
  return JSON.stringify(
    {
      profile: {
        countryOfGraduation: profile.country_of_graduation,
        graduationYear: profile.graduation_year,
        yearsExperience: profile.years_experience,
        englishTestStatus: profile.english_test_status,
        oreStatus: profile.ore_status,
        gdcStatus: profile.gdc_status,
        nhsOrPrivatePreference: profile.nhs_or_private_preference,
        wantsVisaSponsorship: profile.wants_visa_sponsorship,
      },
      identifiedGaps: gaps,
      estimatedTotalTimelineWeeks: timelineWeeks,
      allowedSteps: steps.map((s) => ({
        stepCode: s.code,
        title: s.title,
        description: s.description,
        category: s.category,
        durationWeeksMin: s.typical_duration_weeks_min,
        durationWeeksMax: s.typical_duration_weeks_max,
      })),
    },
    null,
    2
  );
}

export class UngroundedResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UngroundedResponseError";
  }
}

export async function generateRoadmapNarrative(
  input: GenerateRoadmapInput
): Promise<RoadmapOutput> {
  const allowedCodes = new Set(input.steps.map((s) => s.code));

  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserContent(input) }],
    output_config: {
      format: zodOutputFormat(RoadmapOutput),
    },
  });

  if (response.stop_reason === "refusal") {
    throw new Error("Roadmap generation was declined by the model's safety classifiers.");
  }

  const parsed = response.parsed_output;
  if (!parsed) {
    throw new Error("Roadmap generation returned no parsed output.");
  }

  // Defense in depth: the schema + prompt should already guarantee this, but
  // never persist a roadmap that references a step we didn't supply — that
  // would be exactly the hallucinated-fact failure mode this is built to prevent.
  for (const section of parsed.sections) {
    if (!allowedCodes.has(section.stepCode)) {
      throw new UngroundedResponseError(
        `Model referenced step code "${section.stepCode}" which was not in the allowed set.`
      );
    }
  }

  return parsed;
}
