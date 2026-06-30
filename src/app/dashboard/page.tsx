import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Your plans</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Button render={<Link href="/questionnaire" />} size="sm">
            New plan
          </Button>
          <SignOutButton />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {!plans || plans.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              You haven&apos;t generated a plan yet.{" "}
              <Link href="/questionnaire" className="underline">
                Start the questionnaire
              </Link>
              .
            </CardContent>
          </Card>
        ) : (
          plans.map((plan) => (
            <Link key={plan.id} href={`/results/${plan.id}`}>
              <Card className="transition-colors hover:bg-accent">
                <CardHeader>
                  <CardTitle className="text-base">
                    Plan from{" "}
                    {new Date(plan.generated_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {plan.status_summary}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
