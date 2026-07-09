import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import type { GeneratedPlanRow } from "@/lib/types/database";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans } = await supabase
    .from("generated_plans")
    .select("*")
    .order("generated_at", { ascending: false })
    .returns<GeneratedPlanRow[]>();

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[880px] px-8 py-18">
        <div className="flex items-end justify-between gap-6 border-b border-line-strong pb-7">
          <div className="flex flex-col gap-1.5">
            <div className="text-[11px] tracking-[0.2em] text-gold uppercase">
              Client dashboard
            </div>
            <h1 className="font-heading text-[34px] font-semibold">
              Your engagements
            </h1>
            <p className="text-sm text-mut">{user?.email}</p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Link
              href="/questionnaire"
              className={buttonVariants({ size: "action" })}
            >
              New roadmap
            </Link>
            <SignOutButton />
          </div>
        </div>

        <div className="flex flex-col">
          {!plans || plans.length === 0 ? (
            <div className="border-b border-line py-10 text-center text-sm text-mut">
              You haven&apos;t generated a plan yet.{" "}
              <Link href="/questionnaire" className="border-b border-gold text-gold">
                Start the questionnaire
              </Link>
              .
            </div>
          ) : (
            plans.map((plan, i) => (
              <Link
                key={plan.id}
                href={`/results/${plan.id}`}
                className="grid grid-cols-[110px_1fr_auto] items-center gap-6 border-b border-line py-7 transition-colors hover:bg-gold-soft sm:grid-cols-[140px_1fr_auto] sm:gap-8"
              >
                <div className="flex flex-col gap-1">
                  <div className="font-heading text-[17px] font-semibold">
                    {new Date(plan.generated_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div
                    className={
                      "text-[11px] tracking-[0.14em] uppercase " +
                      (i === 0 ? "text-gold" : "text-mut")
                    }
                  >
                    {i === 0 ? "Current" : "Archived"}
                  </div>
                </div>
                <p className="line-clamp-2 text-[14.5px] leading-[1.6] text-mut">
                  {plan.status_summary}
                </p>
                <div className="font-heading text-lg text-gold">→</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
