# DentalBridge AI UK — MVP

Personalized UK dental-career roadmaps for foreign-trained dentists, built
with Next.js, Supabase, and the Claude API.

## Stack

- **Frontend/backend:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui
- **Auth + DB:** Supabase (Postgres + Auth)
- **AI:** Claude API (`claude-sonnet-5`) for narrating a deterministic, rules-engine-selected plan — see `src/lib/rules-engine.ts` and `src/lib/claude.ts`
- **PDF export:** `@react-pdf/renderer`
- **Hosting:** Vercel (recommended)

## One-time setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
   - In the SQL editor, run `db/migrations/0001_init.sql`.
   - Under Project Settings → API, copy the project URL, anon key, and
     service role key.
   - Under Authentication → Providers, email/password is enabled by default.
     For frictionless local testing, you can disable "Confirm email" under
     Authentication → Settings.
   - **To enable "Continue with Google":**
     1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
        create an OAuth 2.0 Client ID (Web application type).
     2. Add `https://<your-project-ref>.supabase.co/auth/v1/callback` as an
        Authorized redirect URI (find your project ref in the Supabase
        dashboard URL or Project Settings → General).
     3. In Supabase, go to Authentication → Providers → Google, enable it,
        and paste in the Google Client ID and Client Secret.
     4. For local dev, also add `http://localhost:3000` to the Google OAuth
        client's Authorized JavaScript origins.
     The app's side of this is already wired up — `src/components/google-signin-button.tsx`
     calls `supabase.auth.signInWithOAuth({ provider: "google" })`, and
     `src/app/auth/callback/route.ts` exchanges the returned code for a
     session. No further code changes needed once the provider is configured.

2. **Get an Anthropic API key** at [platform.claude.com](https://platform.claude.com).

3. **Copy environment variables:**

   ```bash
   cp .env.local.example .env.local
   ```

   Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, and `ANTHROPIC_API_KEY`.

4. **Install dependencies:**

   ```bash
   npm install
   ```

5. **Seed the knowledge base** (pathway steps, archetypes, decision rules):

   ```bash
   npm run db:seed
   ```

   This loads `db/seed/*.json` into Supabase. **Every row is seeded with
   `sme_reviewed = false`.** The content in those files is a structural
   draft — accurate to the best of general knowledge but not yet verified
   against current official GDC/ORE/LDS/visa sources. Have your SME review
   each `pathway_steps` row, correct any inaccuracies, fill in
   `official_source_url`, set `last_verified_date`, and flip
   `sme_reviewed = true` before relying on this with real users. The app
   will still generate plans with unreviewed content (and flags this in the
   UI/PDF with "not yet SME-verified"), but per the project's risk-mitigation
   plan, unreviewed content should not be shown to the real 30–50 dentist
   test cohort.

6. **Run the dev server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
db/migrations/0001_init.sql   Postgres schema (profiles, pathway_steps, archetypes, decision_rules, generated_plans)
db/seed/                      Knowledge base content + seed script (npm run db:seed)
src/lib/rules-engine.ts       Deterministic profile -> pathway_steps mapping (the source of truth for facts)
src/lib/claude.ts             Claude API call that narrates the rules-engine output (never originates facts)
src/lib/pdf/                  @react-pdf/renderer PDF document
src/app/                      Pages: landing, login, signup, questionnaire, results/[planId], dashboard
src/app/auth/callback         OAuth redirect target (Google) — exchanges the code for a session
src/components/google-signin-button.tsx   "Continue with Google" button used on login/signup
src/app/api/generate-plan     POST: profile -> rules engine -> Claude -> saved plan
src/app/api/plans/[id]/pdf    GET: streams the plan as a PDF
docs/                         Phase 0 (idea validation) and Phase 4 (user testing) supporting materials
```

## How a plan is generated (and why it shouldn't hallucinate)

1. The questionnaire saves a `profiles` row.
2. `evaluateRules()` matches that profile against `decision_rules` rows and
   resolves an ordered list of `pathway_steps` — this is plain deterministic
   code, not an LLM call.
3. That ordered step list (titles, descriptions, duration ranges — all from
   the DB) is sent to Claude as the *only* allowed source of facts. The
   system prompt forbids introducing anything not in that list, and the
   response is constrained to a JSON schema requiring one section per
   provided step code.
4. The app validates that every `stepCode` in the response was actually in
   the allowed set before saving — if not, it throws rather than silently
   storing an ungrounded plan.

See `docs/phase4-user-testing/sme-review-checklist.md` for the pre-launch
accuracy validation process this is meant to support.

## Known gaps before real-user testing

- Knowledge base content needs SME review (see step 5 above).
- Email confirmation flow / password reset emails depend on your Supabase
  project's email settings — configure a custom SMTP provider before
  inviting real test users if you don't want Supabase's default rate-limited
  sender.
