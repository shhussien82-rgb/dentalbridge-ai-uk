# Phase 0 — Idea Validation Interview Guide

Goal: talk to 8-10 foreign-trained dentists (via the SME's network, dental
Facebook/WhatsApp/LinkedIn groups) before finalizing the questionnaire and
archetype list. ~20 minutes each. Run before, or in the first days of,
building the MVP — these answers should shape the rules engine.

## Screening

- Trained outside the UK, currently exploring or pursuing UK registration
  (any stage — even "just starting to look into it").

## Questions

1. Walk me through how you first started researching the UK pathway. Where
   did you look, and what was confusing?
2. At what point did you feel like you actually understood the steps you
   needed to take? What got you there (a person, a forum, a course)?
3. Of GDC registration, ORE, LDS, OET/IELTS, and visa sponsorship — which
   ones did you understand clearly vs. find confusing or contradictory
   information about?
4. Did you ever get stuck not knowing what to do *next*? What was that
   moment, and what would have unstuck you?
5. Have you used or considered alternative routes (dental nurse, therapist,
   hygienist) while working toward full registration? Why or why not?
6. If a tool could generate a personalized step-by-step plan for you today,
   what would it absolutely need to include to be useful? What would make
   you not trust it?
7. Would you have paid for something like this? What would feel fair?
8. [If applicable] What's outdated or wrong in advice you've seen online
   about GDC/ORE/visa that you've personally run into?

## What to capture per interview

- Their current stage (use this to sanity-check the archetype list in
  `db/seed/archetypes.json`)
- Specific confusions or wrong-information stories — these are gold for the
  knowledge base and for copy on the results page
- Any profile field we're missing in the questionnaire
- Any pathway step (or alternative route) we haven't accounted for in
  `db/seed/pathway_steps.json`

## After the interviews

Update, in this order: archetype list → questionnaire fields → pathway
steps / decision rules. Don't start the MVP build until this is done — per
the project plan, this phase is what the knowledge base structuring (Phase
1) depends on.
