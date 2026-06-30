import type {
  DecisionRuleRow,
  PathwayStepRow,
  ProfileRow,
  RuleCondition,
} from "@/lib/types/database";

export interface RuleEngineResult {
  /** Pathway steps the user needs, in display order. */
  steps: PathwayStepRow[];
  /** Pathway step codes referenced by a rule but missing from the knowledge base — a content gap to fix, not silently drop. */
  missingStepCodes: string[];
  /** Steps included that have not yet been SME-reviewed — surfaced so the UI can warn the user. */
  unreviewedStepCodes: string[];
}

function evaluateCondition(condition: RuleCondition, profile: ProfileRow): boolean {
  if (condition.op === "always") return true;

  const actual = (profile as unknown as Record<string, unknown>)[condition.field];

  switch (condition.op) {
    case "==":
      return actual === condition.value;
    case "!=":
      return actual !== condition.value;
    case "in":
      return Array.isArray(condition.value) && condition.value.includes(actual as never);
    case "not_in":
      return Array.isArray(condition.value) && !condition.value.includes(actual as never);
    default:
      return false;
  }
}

function ruleMatches(rule: DecisionRuleRow, profile: ProfileRow): boolean {
  return rule.condition.every((condition) => evaluateCondition(condition, profile));
}

/**
 * Deterministically maps a profile to the pathway steps it needs. This is
 * the source of truth for *which facts apply* — the LLM is only used later
 * to narrate this output, never to decide it. See decision_rules.json for
 * the rule definitions.
 */
export function evaluateRules(
  profile: ProfileRow,
  rules: DecisionRuleRow[],
  pathwaySteps: PathwayStepRow[]
): RuleEngineResult {
  const stepsByCode = new Map(pathwaySteps.map((step) => [step.code, step]));

  const matchedRules = rules
    .filter((rule) => ruleMatches(rule, profile))
    .sort((a, b) => a.priority - b.priority);

  const orderedCodes: string[] = [];
  const seen = new Set<string>();
  for (const rule of matchedRules) {
    for (const code of rule.action.add_steps) {
      if (!seen.has(code)) {
        seen.add(code);
        orderedCodes.push(code);
      }
    }
  }

  const steps: PathwayStepRow[] = [];
  const missingStepCodes: string[] = [];
  const unreviewedStepCodes: string[] = [];

  for (const code of orderedCodes) {
    const step = stepsByCode.get(code);
    if (!step) {
      missingStepCodes.push(code);
      continue;
    }
    steps.push(step);
    if (!step.sme_reviewed) unreviewedStepCodes.push(code);
  }

  return { steps, missingStepCodes, unreviewedStepCodes };
}

export function estimateTimelineWeeks(steps: PathwayStepRow[]): {
  min: number;
  max: number;
} {
  // Conservative MVP heuristic: sum the ranges (treats steps as sequential).
  // This deliberately overestimates rather than underestimates duration —
  // some steps can run in parallel in reality, but a confused user is
  // better served by a cautious estimate than an optimistic one.
  return steps.reduce(
    (acc, step) => ({
      min: acc.min + step.typical_duration_weeks_min,
      max: acc.max + step.typical_duration_weeks_max,
    }),
    { min: 0, max: 0 }
  );
}

export function identifyGaps(profile: ProfileRow): string[] {
  const gaps: string[] = [];
  if (profile.english_test_status !== "passed") {
    gaps.push("No passed English-language test (OET/IELTS) on file yet.");
  }
  if (profile.gdc_status !== "full" && profile.ore_status === "not_started") {
    gaps.push("ORE pathway not yet started.");
  }
  if (profile.gdc_status !== "full" && profile.ore_status === "part1_failed") {
    gaps.push("ORE Part 1 was not passed on the last attempt.");
  }
  if (profile.gdc_status === "none") {
    gaps.push("No GDC registration (provisional or full) yet.");
  }
  if (profile.wants_visa_sponsorship) {
    gaps.push("Will need an employer willing to sponsor a Skilled Worker visa.");
  }
  return gaps;
}
