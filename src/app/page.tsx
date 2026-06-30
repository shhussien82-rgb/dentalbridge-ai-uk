import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STEPS = [
  {
    title: "Tell us where you stand",
    description:
      "Country of graduation, GDC status, ORE progress, English test, and whether you need visa sponsorship.",
  },
  {
    title: "Get a personalized plan",
    description:
      "Our rules engine matches your profile against a structured GDC/ORE/LDS/visa knowledge base, then AI writes it up in plain English.",
  },
  {
    title: "Save it and track progress",
    description:
      "Revisit your plan anytime from your dashboard, or export it as a PDF.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Build your UK Dental Career Plan with AI
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Confused about GDC, ORE, LDS, OET, visas, and where to even start?
          Answer a few questions and get one clear, personalized roadmap to
          your first UK dental job.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button render={<Link href="/signup" />} size="lg">
            Build my plan
          </Button>
          <Button render={<Link href="/login" />} size="lg" variant="outline">
            Log in
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Card key={step.title}>
              <CardHeader>
                <CardTitle className="text-base">
                  {i + 1}. {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {step.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 text-center text-sm text-muted-foreground">
        <p>
          DentalBridge AI UK is an informational planning tool, not a
          substitute for official guidance from the GDC, UKVI, or your
          dental defence organization. Always verify requirements against
          official sources before making decisions.
        </p>
      </section>
    </main>
  );
}
