-- DentalBridge AI UK — initial schema
-- Run this in the Supabase SQL editor (or `supabase db push`) once per project.

-- ---------------------------------------------------------------------------
-- profiles: one row per questionnaire submission (versioned — a user can
-- retake the questionnaire and we keep prior submissions for history).
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  country_of_graduation text not null,
  graduation_year integer not null,
  years_experience integer not null default 0,
  english_test_status text not null check (english_test_status in ('none', 'booked', 'passed')),
  english_test_type text check (english_test_type in ('OET', 'IELTS')),
  english_score text,
  ore_status text not null check (
    ore_status in ('not_started', 'part1_passed', 'part1_failed', 'part2_passed', 'exempt')
  ),
  gdc_status text not null check (gdc_status in ('none', 'provisional', 'full', 'lapsed')),
  nhs_or_private_preference text not null check (
    nhs_or_private_preference in ('nhs', 'private', 'either')
  ),
  wants_visa_sponsorship boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists profiles_user_id_idx on public.profiles (user_id);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- archetypes: knowledge-base user archetype labels (informational/grouping —
-- the rules engine matches on `profiles` fields directly, archetypes are
-- used for content authoring and reporting, not as a hard gate).
-- ---------------------------------------------------------------------------
create table if not exists public.archetypes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text not null,
  description text not null,
  matching_rule_summary text not null
);

alter table public.archetypes enable row level security;
create policy "archetypes_select_all" on public.archetypes for select using (true);

-- ---------------------------------------------------------------------------
-- pathway_steps: the actual regulatory/process content. This is the source
-- of truth for facts — the LLM is only allowed to narrate rows from here,
-- never invent new ones. Every row should be SME-reviewed before being
-- marked sme_reviewed = true and used in production output.
-- ---------------------------------------------------------------------------
create table if not exists public.pathway_steps (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null,
  category text not null check (
    category in ('registration', 'exam', 'language', 'visa', 'job_search', 'alt_route')
  ),
  typical_duration_weeks_min integer not null,
  typical_duration_weeks_max integer not null,
  prerequisites text[] not null default '{}', -- array of pathway_steps.code
  official_source_url text,
  last_verified_date date,
  sme_reviewed boolean not null default false
);

alter table public.pathway_steps enable row level security;
create policy "pathway_steps_select_all" on public.pathway_steps for select using (true);

-- ---------------------------------------------------------------------------
-- decision_rules: the rules engine. `condition` and `action` are small JSON
-- expressions evaluated in application code (src/lib/rules-engine.ts) — kept
-- in the DB so the knowledge-base owner can add/edit rules without a deploy.
-- ---------------------------------------------------------------------------
create table if not exists public.decision_rules (
  id uuid primary key default gen_random_uuid(),
  condition jsonb not null, -- array of conditions, AND-ed together, e.g.
                             -- [{"field":"ore_status","op":"==","value":"not_started"}]
  action jsonb not null,    -- e.g. {"add_steps":["ore_part1_prep","ore_part1_exam"]}
  priority integer not null default 100,
  notes text
);

alter table public.decision_rules enable row level security;
create policy "decision_rules_select_all" on public.decision_rules for select using (true);

-- ---------------------------------------------------------------------------
-- generated_plans: saved report per user.
-- ---------------------------------------------------------------------------
create table if not exists public.generated_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  generated_at timestamptz not null default now(),
  status_summary text not null,
  gaps jsonb not null default '[]',
  steps jsonb not null default '[]', -- ordered list of {step_code, narrative}
  estimated_timeline_weeks_min integer,
  estimated_timeline_weeks_max integer,
  raw_llm_output text,
  pdf_generated_at timestamptz
);

create index if not exists generated_plans_user_id_idx on public.generated_plans (user_id);

alter table public.generated_plans enable row level security;

create policy "generated_plans_select_own" on public.generated_plans
  for select using (auth.uid() = user_id);

create policy "generated_plans_insert_own" on public.generated_plans
  for insert with check (auth.uid() = user_id);
