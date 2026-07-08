import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { GeneratedPlanRow, PathwayStepRow } from "@/lib/types/database";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  const supabase = await createClient();

  const { data: plan } = await supabase
    .from("generated_plans")
    .select("*")
    .eq("id", planId)
    .single<GeneratedPlanRow>();

  if (!plan) notFound();

  const stepCodes = plan.steps.map((s) => s.step_code);
  const { data: pathwaySteps } = await supabase
    .from("pathway_steps")
    .select("*")
    .in("code", stepCodes)
    .returns<PathwayStepRow[]>();

  const stepsByCode = new Map((pathwaySteps ?? []).map((s) => [s.code, s]));

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Your UK Dental Career Plan</h1>
        <div className="flex gap-2">
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Dashboard
          </Link>
          <a
            href={`/api/plans/${plan.id}/pdf`}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ size: "sm" })}
          >
            Download PDF
          </a>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Where you stand</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{plan.status_summary}</p>
          {plan.gaps.length > 0 && (
            <div>
              <p className="text-sm font-medium">Key gaps</p>
              <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                {plan.gaps.map((gap) => (
                  <li key={gap}>{gap}</li>
                ))}
              </ul>
            </div>
          )}
          {plan.estimated_timeline_weeks_min != null && (
            <p className="text-sm">
              <span className="font-medium">Estimated timeline: </span>
              {plan.estimated_timeline_weeks_min}–{plan.estimated_timeline_weeks_max} weeks
              (steps are shown sequentially; some can run in parallel in practice)
            </p>
          )}
        </CardContent>
      </Card>

      <h2 className="mt-8 text-lg font-semibold">Your step-by-step plan</h2>
      <div className="mt-4 space-y-4">
        {plan.steps.map((s, i) => {
          const step = stepsByCode.get(s.step_code);
          return (
            <Card key={s.step_code}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">
                    {i + 1}. {step?.title ?? s.step_code}
                  </CardTitle>
                  {step && <Badge variant="secondary">{step.category}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">{s.narrative}</p>
                {step && (
                  <p className="text-xs text-muted-foreground">
                    Typical duration: {step.typical_duration_weeks_min}–
                    {step.typical_duration_weeks_max} weeks
                    {!step.sme_reviewed && " · not yet SME-verified"}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator className="my-8" />
      <p className="text-xs text-muted-foreground">
        This plan is generated from a structured knowledge base and AI
        narration. It is informational and does not replace official GDC,
        UKVI, or NHS guidance — always verify current requirements directly
        with those bodies before making decisions.
      </p>
    </main>
  );
}
