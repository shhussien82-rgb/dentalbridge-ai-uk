# SME Review Checklist — Knowledge Base Accuracy

This is the core mitigation for the project's single biggest risk: an LLM
generating roadmaps that contain wrong GDC/ORE/LDS/visa information for a
confused, high-stakes audience. Two checkpoints:

## Checkpoint 1 — Before any real user sees a plan

Review every row in `db/seed/pathway_steps.json` (loaded via
`npm run db:seed`) against current official sources (GDC, GOV.UK visa
pages, relevant dental school LDS program pages):

For each `pathway_steps` row:

- [ ] `title` and `description` are factually accurate as of today
- [ ] `typical_duration_weeks_min` / `_max` are realistic ranges, not
      guesses
- [ ] `prerequisites` correctly reflects what must happen first
- [ ] `official_source_url` is filled in with a real, current, specific
      source page (these were left blank in the initial draft seed
      deliberately, to avoid shipping a guessed URL)
- [ ] `last_verified_date` is set to today's date
- [ ] Once accurate: set `sme_reviewed = true`

Then spot-check the **generated narrative**, not just the raw facts: run
the questionnaire as 15-20 different synthetic profiles covering the main
branches in `db/seed/decision_rules.json` (new grad / ORE Part 1 passed /
has GDC wants job / wants visa sponsorship / etc.), and for each generated
plan check:

- [ ] Every claim in the AI-written narrative traces back to a real
      `pathway_steps` row (the app already enforces this technically — see
      `UngroundedResponseError` in `src/lib/claude.ts` — but read the prose
      itself for accuracy of *tone*, e.g. nothing that overstates certainty)
- [ ] No step is missing that should be there for that profile
- [ ] The order makes sense

**Go/no-go bar:** zero critical regulatory errors across this sample before
inviting the 30-50 dentist test cohort.

## Checkpoint 2 — Ongoing during the test cohort

- [ ] Weekly: pull a rotating sample of real generated plans (`generated_plans`
      table) and re-check accuracy
- [ ] Weekly: review every "something seemed wrong" response from
      `feedback-survey.md` Q1
- [ ] If any `pathway_steps` row needs a correction, edit
      `db/seed/pathway_steps.json` and re-run `npm run db:seed` (it upserts
      on `code`, so existing rows are safely updated)
