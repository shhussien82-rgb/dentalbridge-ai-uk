import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import type { GeneratedPlanRow, PathwayStepRow } from "@/lib/types/database";
import { cn } from "@/lib/utils";

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

  const reportDate = new Date(plan.generated_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[880px] px-8 py-18">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="text-[11px] tracking-[0.2em] text-gold uppercase">
              Engagement report · {reportDate}
            </div>
            <h1 className="font-heading text-[34px] font-semibold">
              Your UK dental career roadmap
            </h1>
          </div>
          <div className="flex shrink-0 gap-3">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "outline", size: "action" })}
            >
              Dashboard
            </Link>
            <a
              href={`/api/plans/${plan.id}/pdf`}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ size: "action" })}
            >
              Download PDF
            </a>
          </div>
        </div>

        <div className="mt-9 grid grid-cols-1 border border-line bg-surface md:grid-cols-[1fr_240px]">
          <div className="flex flex-col gap-5 border-b border-line p-8 md:border-r md:border-b-0">
            <div className="text-[11px] tracking-[0.2em] text-gold uppercase">
              Where you stand
            </div>
            <p className="text-[15.5px] leading-[1.65]">{plan.status_summary}</p>
            {plan.gaps.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="text-xs font-medium tracking-[0.1em] text-mut uppercase">
                  Key gaps
                </div>
                <div className="flex flex-wrap gap-2">
                  {plan.gaps.map((gap) => (
                    <span
                      key={gap}
                      className="border border-line-strong px-3 py-1.5 text-[13px]"
                    >
                      {gap}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-1.5 bg-gold-soft p-8">
            <div className="text-[11px] tracking-[0.2em] text-gold uppercase">
              Estimated timeline
            </div>
            {plan.estimated_timeline_weeks_min != null && (
              <div className="font-heading text-[44px] leading-none font-semibold">
                {plan.estimated_timeline_weeks_min}–
                {plan.estimated_timeline_weeks_max}
              </div>
            )}
            <div className="text-[13px] text-mut">
              weeks · some steps run in parallel
            </div>
          </div>
        </div>

        <div className="mt-12 text-[11px] tracking-[0.2em] text-gold uppercase">
          The plan, step by step
        </div>
        <div className="mt-6 flex flex-col">
          {plan.steps.map((s, i) => {
            const step = stepsByCode.get(s.step_code);
            const isLast = i === plan.steps.length - 1;
            return (
              <div key={s.step_code} className="grid grid-cols-[64px_1fr] gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex size-10 shrink-0 items-center justify-center border border-gold bg-background font-heading text-sm font-semibold text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    className={cn(
                      "w-px flex-1",
                      isLast ? "bg-transparent" : "bg-line-strong"
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2.5 pb-9">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-heading text-[19px] font-semibold">
                      {step?.title ?? s.step_code}
                    </div>
                    {step && (
                      <span className="shrink-0 border border-gold px-2.5 py-1 text-[11px] tracking-[0.14em] text-gold uppercase">
                        {step.category}
                      </span>
                    )}
                  </div>
                  <p className="text-pretty text-[14.5px] leading-[1.65] text-mut">
                    {s.narrative}
                  </p>
                  {step && (
                    <div className="text-[12.5px] text-mut">
                      Typical duration: {step.typical_duration_weeks_min}–
                      {step.typical_duration_weeks_max} weeks
                      {!step.sme_reviewed && (
                        <>
                          {" · "}
                          <span className="text-gold">not yet SME-verified</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 border-t border-line pt-7">
          <p className="max-w-[640px] text-pretty text-[12.5px] leading-[1.6] text-mut">
            This roadmap is generated from a structured knowledge base with AI
            narration. It is informational and does not replace official GDC,
            UKVI, or NHS guidance — always verify current requirements
            directly with those bodies.
          </p>
        </div>
      </div>
    </main>
  );
}
