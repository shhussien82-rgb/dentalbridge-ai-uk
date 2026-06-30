import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { profileFormSchema } from "@/lib/schemas/profile";
import { evaluateRules, estimateTimelineWeeks, identifyGaps } from "@/lib/rules-engine";
import { generateRoadmapNarrative } from "@/lib/claude";
import type {
  DecisionRuleRow,
  PathwayStepRow,
  ProfileRow,
} from "@/lib/types/database";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = profileFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid profile data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .insert({
      ...parsed.data,
      english_test_type: parsed.data.english_test_type ?? null,
      english_score: parsed.data.english_score ?? null,
      user_id: user.id,
    })
    .select()
    .single<ProfileRow>();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: profileError?.message ?? "Could not save profile" },
      { status: 500 }
    );
  }

  const [{ data: pathwaySteps, error: stepsError }, { data: decisionRules, error: rulesError }] =
    await Promise.all([
      supabase.from("pathway_steps").select("*").returns<PathwayStepRow[]>(),
      supabase.from("decision_rules").select("*").returns<DecisionRuleRow[]>(),
    ]);

  if (stepsError || rulesError || !pathwaySteps || !decisionRules) {
    return NextResponse.json(
      { error: "Knowledge base is not seeded yet — run `npm run db:seed`." },
      { status: 500 }
    );
  }

  const ruleResult = evaluateRules(profile, decisionRules, pathwaySteps);
  const gaps = identifyGaps(profile);
  const timeline = estimateTimelineWeeks(ruleResult.steps);

  let narrative;
  try {
    narrative = await generateRoadmapNarrative({
      profile,
      steps: ruleResult.steps,
      gaps,
      timelineWeeks: timeline,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Roadmap generation failed" },
      { status: 502 }
    );
  }

  const stepsForStorage = narrative.sections.map((section) => ({
    step_code: section.stepCode,
    narrative: section.narrative,
  }));

  const { data: plan, error: planError } = await supabase
    .from("generated_plans")
    .insert({
      user_id: user.id,
      profile_id: profile.id,
      status_summary: narrative.statusSummary,
      gaps,
      steps: stepsForStorage,
      estimated_timeline_weeks_min: timeline.min,
      estimated_timeline_weeks_max: timeline.max,
      raw_llm_output: JSON.stringify(narrative),
      pdf_generated_at: null,
    })
    .select("id")
    .single();

  if (planError || !plan) {
    return NextResponse.json(
      { error: planError?.message ?? "Could not save plan" },
      { status: 500 }
    );
  }

  if (ruleResult.unreviewedStepCodes.length > 0) {
    console.warn(
      `Plan ${plan.id} includes ${ruleResult.unreviewedStepCodes.length} step(s) not yet SME-reviewed:`,
      ruleResult.unreviewedStepCodes
    );
  }

  return NextResponse.json({ planId: plan.id });
}
