// Hand-written to match db/migrations/0001_init.sql. If the schema changes,
// update this file (or swap to `supabase gen types typescript` once a real
// Supabase project exists).

export type EnglishTestStatus = "none" | "booked" | "passed";
export type EnglishTestType = "OET" | "IELTS";
export type OreStatus =
  | "not_started"
  | "part1_passed"
  | "part1_failed"
  | "part2_passed"
  | "exempt";
export type GdcStatus = "none" | "provisional" | "full" | "lapsed";
export type NhsOrPrivatePreference = "nhs" | "private" | "either";
export type PathwayStepCategory =
  | "registration"
  | "exam"
  | "language"
  | "visa"
  | "job_search"
  | "alt_route";

// These are `type` (not `interface`) declarations on purpose: a hand-written
// Database type must structurally satisfy supabase-js's GenericTable
// (`Row`/`Insert`/`Update` extends `Record<string, unknown>`), and plain
// `interface` declarations are not assignable to index-signature types like
// `Record<string, unknown>` the way object-literal `type` aliases are.
export type ProfileRow = {
  id: string;
  user_id: string;
  country_of_graduation: string;
  graduation_year: number;
  years_experience: number;
  english_test_status: EnglishTestStatus;
  english_test_type: EnglishTestType | null;
  english_score: string | null;
  ore_status: OreStatus;
  gdc_status: GdcStatus;
  nhs_or_private_preference: NhsOrPrivatePreference;
  wants_visa_sponsorship: boolean;
  created_at: string;
};

export type ArchetypeRow = {
  id: string;
  code: string;
  label: string;
  description: string;
  matching_rule_summary: string;
};

export type PathwayStepRow = {
  id: string;
  code: string;
  title: string;
  description: string;
  category: PathwayStepCategory;
  typical_duration_weeks_min: number;
  typical_duration_weeks_max: number;
  prerequisites: string[];
  official_source_url: string | null;
  last_verified_date: string | null;
  sme_reviewed: boolean;
};

export type RuleCondition = {
  field: keyof ProfileRow | "*";
  op: "==" | "!=" | "in" | "not_in" | "always";
  value?: string | number | boolean | (string | number)[];
};

export type RuleAction = {
  add_steps: string[]; // pathway_steps.code values
};

export type DecisionRuleRow = {
  id: string;
  condition: RuleCondition[]; // all entries are AND-ed together
  action: RuleAction;
  priority: number;
  notes: string | null;
};

export type GeneratedPlanRow = {
  id: string;
  user_id: string;
  profile_id: string;
  generated_at: string;
  status_summary: string;
  gaps: string[];
  steps: { step_code: string; narrative: string }[];
  estimated_timeline_weeks_min: number | null;
  estimated_timeline_weeks_max: number | null;
  raw_llm_output: string | null;
  pdf_generated_at: string | null;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "id" | "created_at">;
        Update: Partial<Omit<ProfileRow, "id">>;
        Relationships: [];
      };
      archetypes: {
        Row: ArchetypeRow;
        Insert: Omit<ArchetypeRow, "id">;
        Update: Partial<Omit<ArchetypeRow, "id">>;
        Relationships: [];
      };
      pathway_steps: {
        Row: PathwayStepRow;
        Insert: Omit<PathwayStepRow, "id">;
        Update: Partial<Omit<PathwayStepRow, "id">>;
        Relationships: [];
      };
      decision_rules: {
        Row: DecisionRuleRow;
        Insert: Omit<DecisionRuleRow, "id">;
        Update: Partial<Omit<DecisionRuleRow, "id">>;
        Relationships: [];
      };
      generated_plans: {
        Row: GeneratedPlanRow;
        Insert: Omit<GeneratedPlanRow, "id" | "generated_at">;
        Update: Partial<Omit<GeneratedPlanRow, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
