# Handoff: DentalBridge "UK Pathway Advisory" Redesign

## Overview
A full visual + UX redesign of the DentalBridge AI UK app (Next.js + Tailwind + shadcn/ui + Supabase). Direction: premium boutique consulting — warm charcoal / gold-bronze palette, geometric sans typography, light **and** dark mode. Covers all six screens: landing, login, signup, questionnaire, dashboard, results. Also introduces a refreshed brand (DB monogram + letterspaced wordmark).

## About the Design Files
`DentalBridge Redesign.dc.html` is a **design reference created in HTML** — a prototype showing intended look and behavior, not production code. The task is to **recreate this design inside the existing codebase** (`Dental/` — Next.js App Router, TypeScript, Tailwind v4, shadcn/ui with base-ui primitives), using its established patterns:

- Theme via CSS variables in `src/app/globals.css` (`:root` + `.dark`), consumed through Tailwind theme tokens — replace the current neutral values with the palette below.
- Restyle the existing shadcn components (`button.tsx`, `card.tsx`, `input.tsx`, etc.) rather than creating parallel ones.
- Keep all existing data flow (react-hook-form + zod, Supabase, rules engine, PDF export) untouched — this is a presentation-layer redesign, plus one structural change (stepped questionnaire).

## Fidelity
**High-fidelity.** Colors, typography, spacing, and copy are final. Recreate pixel-perfectly. The user's chosen default theme is **light**; dark mode must remain fully supported via a visible toggle.

## Brand
- Mark: 36×36px square, 1px solid gold border, "DB" centered — Space Grotesk 600, 15px, letter-spacing 0.05em, gold.
- Wordmark: "DENTALBRIDGE" — Space Grotesk 600, 15px, letter-spacing 0.14em.
- Descriptor below: "UK Pathway Advisory" — 10.5px, letter-spacing 0.18em, uppercase, muted.
- Footer variant: 28×28px mark, 12px "DB".
- **No border radius anywhere** — squared corners are a core part of the aesthetic (buttons, cards, inputs, tags). Set `--radius: 0` or remove rounding classes.

## Design Tokens

Fonts (Google Fonts, replace Geist in `layout.tsx`):
- Headings / numerals / brand: **Space Grotesk** (400–700)
- Body / UI: **Archivo** (400–600)

Dark theme:
- `--bg: oklch(0.17 0.008 75)` (page background)
- `--surface: oklch(0.205 0.009 75)` (cards, nav panels)
- `--surface2: oklch(0.245 0.011 75)` (raised chrome)
- `--line: oklch(1 0 0 / 0.10)` (hairline borders)
- `--line-strong: oklch(1 0 0 / 0.18)` (input/button borders)
- `--ink: oklch(0.95 0.006 85)` (text)
- `--mut: oklch(0.70 0.014 80)` (muted text)
- `--gold: oklch(0.78 0.105 80)` (accent)
- `--gold-ink: oklch(0.20 0.03 80)` (text on gold)
- `--gold-soft: oklch(0.78 0.105 80 / 0.12)` (accent tint bg)

Light theme (default):
- `--bg: oklch(0.972 0.006 85)` · `--surface: oklch(0.995 0.002 90)` · `--surface2: oklch(0.948 0.008 85)`
- `--line: oklch(0.88 0.012 85)` · `--line-strong: oklch(0.80 0.016 85)`
- `--ink: oklch(0.24 0.014 75)` · `--mut: oklch(0.49 0.018 78)`
- `--gold: oklch(0.585 0.115 75)` · `--gold-ink: oklch(0.99 0.002 90)` · `--gold-soft: oklch(0.585 0.115 75 / 0.10)`

Mapping to existing shadcn vars: `--background←bg`, `--card←surface`, `--border←line`, `--input←line-strong`, `--foreground←ink`, `--muted-foreground←mut`, `--primary←gold`, `--primary-foreground←gold-ink`, `--accent←gold-soft`, `--ring←gold`.

Type scale: hero H1 58px/1.06 Space Grotesk 600 letter-spacing −0.02em; page H1 34px 600; section titles 21–26px 600; body 14.5–18px Archivo, line-height 1.6–1.65; eyebrows 11–12px uppercase letter-spacing 0.2em gold; labels 12px uppercase letter-spacing 0.1em muted 500.

Buttons (all `white-space: nowrap`, no radius):
- Primary: gold bg, gold-ink text, Archivo 12.5–13px 600, uppercase, letter-spacing 0.10em; heights 40px (nav), 44px (page actions), 48–52px (CTAs/forms); hover `filter: brightness(1.07)`.
- Secondary: transparent bg, 1px `--line-strong` border, ink or muted text; hover border/gold text.
- Ghost gold: transparent, 1px gold border, gold text; hover `--gold-soft` bg.

Inputs: 46px height, 1px `--line-strong` border, `--bg` fill, 15px text, 0 14px padding; focus border gold.

## Screens / Views

### 1. Global nav (all pages — new; currently pages are bare)
Sticky header, 72px, `--bg` bg, 1px `--line` bottom border, max-width 1200px, 32px side padding. Left: brand lockup (links home). Right (gap 28px): "How it works" and "Log in" links (14px, muted → ink on hover), primary button "Begin assessment" (40px), theme toggle button (40px, outlined, 10px gold dot + label "Light"/"Dark"). Theme should persist (e.g. localStorage + `.dark` class on `<html>`).

### 2. Landing (`src/app/page.tsx`)
- Hero: two-column grid 1.15fr/0.85fr, gap 80px, padding 96/32/80.
  - Left: eyebrow "— For internationally trained dentists" (gold, 32px rule before text); H1 "Your UK dental career, precisely mapped."; sub-copy 18px muted: "GDC. ORE. OET. Visas. We distil the regulatory maze into one sequenced, personal roadmap — drawn from a verified knowledge base and written in plain English."; buttons "Begin your assessment" (primary 52px) + "View a sample roadmap" (secondary 52px); footnote 13px muted "Six questions. Three minutes. One roadmap."
  - Right: "Sample engagement" card — `--surface` bg, 1px `--line` border, 32px padding; header row title + gold "28–62 WEEKS"; 4 rows separated by hairlines, each: gold Space Grotesk number (01–04) + title 15px 500 + sub 13px muted. Content: 01 English competency / OET pass, dentistry version; 02 ORE Parts 1 & 2 / Sequenced around sitting availability; 03 Full GDC registration / Documents, declarations, timing; 04 First UK post / Sponsorship & supervised practice.
- Process band: `--surface` bg, top hairline, 80px padding. Eyebrow "HOW AN ENGAGEMENT WORKS". 3 equal columns, gap 48px, each with top rule (`--line-strong`), gold label ("01 — Assessment" / "02 — Analysis" / "03 — Roadmap"), 21px title ("Tell us where you stand" / "Facts first, then narrative" / "One sequenced plan"), 15px muted body (copy in prototype).
- Trust band: single row, statement (16px, max 640px) "Every requirement in your plan is traced to GDC, UKVI and NHS sources, and flagged until reviewed by subject-matter experts." + ghost-gold "Start now" button.
- Footer: brand lockup left, 12.5px muted disclaimer right (max 560px).

### 3. Login / Signup (`src/app/login`, `src/app/signup`)
Centered 420px panel, `--surface` bg, `--line` border, 40px padding. Header: gold eyebrow ("WELCOME BACK" / "NEW ENGAGEMENT") + 26px title ("Log in" / "Create your account"), hairline below. Body: Google button (46px, outlined, official Google G icon — reuse `google-signin-button.tsx`), "— or —" divider, Email + Password fields (uppercase 12px labels), primary submit 48px ("LOG IN" / "BEGIN ASSESSMENT"), swap link ("No account yet? Sign up" — gold with gold underline).

### 4. Questionnaire (`src/app/questionnaire`) — structural change
Replace the single long form with a **4-step wizard**. Grid 300px rail + content, gap 72px, max-width 1080px.
- Rail (sticky): gold eyebrow "ASSESSMENT · STEP n OF 4"; 4 clickable rows, each 2px left border (gold when active, `--line` otherwise), `--gold-soft` bg when active; row = number 01–04 (✓ when complete, gold) + title 15px + desc 12.5px muted. Steps: Background / English test / GDC & ORE / Preferences.
- Content card: `--surface`, 40px padding, min-height 380px. Each step: 24px Space Grotesk title + 14px muted subtitle, then fields.
  - Step 1: Country (text), Graduation year + Years of clinical experience (2-col numbers).
  - Step 2: Status as **3 selectable tiles** (Not booked yet / Booked / Passed) — tile: 14–16px padding, centered 14px text, border `--line-strong`; selected: gold border, `--gold-soft` bg, gold 600 text. Plus optional score input. Keep the existing conditional test-type (OET/IELTS) logic when status ≠ none.
  - Step 3: GDC registration tiles ×4 (2-col) + ORE progress tiles ×4 (2-col) — same tile pattern, values match existing zod schema.
  - Step 4: NHS/Private/Either tiles ×3 + visa checkbox row (bordered 16px row, 18px square checkbox: gold fill when checked).
- Footer row (hairline above): "Back" secondary (disabled/dimmed on step 1) + primary "Continue" / "Generate my roadmap" (48px). Final submit posts to `/api/generate-plan` as today. Keep react-hook-form + zod; validate per-step before advancing.

### 5. Dashboard (`src/app/dashboard`)
Max-width 880px. Header (hairline `--line-strong` below): gold eyebrow "CLIENT DASHBOARD", H1 34px "Your engagements", user email 14px muted; right: primary "New roadmap" + secondary "Sign out" (44px). Plans as **ledger rows** (not cards): grid 140px/1fr/auto, 28px vertical padding, hairline separators, hover bg `--gold-soft`. Row = date (17px Space Grotesk 600) + status tag ("CURRENT" gold / "ARCHIVED" muted, 11px letterspaced) | 2-line-clamped summary 14.5px muted | gold "→". Empty state: keep existing message, styled to match.

### 6. Results (`src/app/results/[planId]`)
Max-width 880px. Header: gold eyebrow "ENGAGEMENT REPORT · {date}", H1 34px "Your UK dental career roadmap"; actions: secondary "Dashboard" + primary "Download PDF" (44px, wired to existing PDF route).
- Summary panel: grid 1fr/240px, `--surface`, `--line` border. Left (32px padding): eyebrow "WHERE YOU STAND", status summary 15.5px, "KEY GAPS" label + gaps as bordered chips (6/12px padding, 13px). Right cell: `--gold-soft` bg, eyebrow "ESTIMATED TIMELINE", 44px Space Grotesk range ("28–62"), "weeks · some steps run in parallel" 13px muted.
- Steps: eyebrow "THE PLAN, STEP BY STEP", then vertical timeline: grid 64px/1fr per step; 40×40 gold-bordered square with Space Grotesk number, 1px vertical rail (`--line-strong`) connecting to next; content = 19px title + category tag (11px uppercase, gold text + gold border, e.g. EXAMS / REGISTRATION / VISA / EMPLOYMENT from `pathway_steps.category`) + 14.5px muted narrative + "Typical duration: X–Y weeks · not yet SME-verified" (verification flag in gold, only when `sme_reviewed=false`).
- Footer disclaimer 12.5px muted above nothing else (hairline above).

## Interactions & Behavior
- Theme toggle: swaps light/dark token sets; default **light**; persist choice.
- All hovers listed under tokens; links muted→ink; ledger rows tint gold on hover.
- Wizard: rail rows jump to their step; Back/Continue navigate; validation per step; final step submits and routes to results (existing flow).
- No new animations required; optional 150ms ease on color/border hovers.
- The floating bottom screen-switcher pill in the prototype is **prototype chrome only — do not implement**.

## State Management
- `theme: "light" | "dark"` (context or class on `<html>`, localStorage).
- Questionnaire: `step: 0–3` + existing react-hook-form state; selectable tiles set the same form values the current selects/radios set (no schema changes).
- Everything else uses existing server data (Supabase queries unchanged).

## Assets
- Google G icon: already in codebase (`src/components/google-signin-button.tsx`).
- Chevron/check icons: lucide-react (already a dependency).
- Fonts: Space Grotesk + Archivo via `next/font/google`.
- No images required.

## Files
- `DentalBridge Redesign.dc.html` — interactive hi-fi prototype (all six screens, working theme toggle and wizard). Open in a browser; inline styles are the source of truth for exact values.
