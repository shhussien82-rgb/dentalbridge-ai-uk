// Loads the knowledge-base JSON files into Supabase.
// Run once after applying db/migrations/0001_init.sql, and again any time
// the knowledge base content changes:
//   node db/seed/seed.mjs
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment
// (the service role key bypasses RLS — never expose it client-side).

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars. Set them and re-run."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function loadJson(file) {
  const raw = await readFile(path.join(__dirname, file), "utf-8");
  return JSON.parse(raw);
}

async function main() {
  const pathwaySteps = await loadJson("pathway_steps.json");
  const archetypes = await loadJson("archetypes.json");
  const decisionRules = await loadJson("decision_rules.json");

  console.log(`Seeding ${pathwaySteps.length} pathway_steps...`);
  const { error: stepsError } = await supabase
    .from("pathway_steps")
    .upsert(pathwaySteps, { onConflict: "code" });
  if (stepsError) throw stepsError;

  console.log(`Seeding ${archetypes.length} archetypes...`);
  const { error: archetypesError } = await supabase
    .from("archetypes")
    .upsert(archetypes, { onConflict: "code" });
  if (archetypesError) throw archetypesError;

  console.log(`Replacing decision_rules with ${decisionRules.length} rules...`);
  // decision_rules has no natural unique key to upsert on, so wipe and
  // reinsert on every seed run — it's small and fully owned by this file.
  const { error: deleteError } = await supabase
    .from("decision_rules")
    .delete()
    .not("id", "is", null);
  if (deleteError) throw deleteError;

  const { error: rulesError } = await supabase
    .from("decision_rules")
    .insert(decisionRules);
  if (rulesError) throw rulesError;

  console.log("Seed complete.");
  console.log(
    "Reminder: every pathway_step was inserted with sme_reviewed = false. " +
      "Have the SME review and flip that flag before relying on this content with real users."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
