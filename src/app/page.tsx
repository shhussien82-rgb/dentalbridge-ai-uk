import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";

const SAMPLE_STEPS = [
  {
    num: "01",
    title: "English competency",
    sub: "OET pass, dentistry version",
  },
  {
    num: "02",
    title: "ORE Parts 1 & 2",
    sub: "Sequenced around sitting availability",
  },
  {
    num: "03",
    title: "Full GDC registration",
    sub: "Documents, declarations, timing",
  },
  {
    num: "04",
    title: "First UK post",
    sub: "Sponsorship & supervised practice",
  },
];

const PROCESS = [
  {
    label: "01 — Assessment",
    title: "Tell us where you stand",
    body: "A structured, three-minute questionnaire: qualification, GDC status, ORE progress, English test, visa position.",
  },
  {
    label: "02 — Analysis",
    title: "Facts first, then narrative",
    body: "A deterministic rules engine selects your steps from a verified GDC/ORE/visa knowledge base. AI only writes it up — it never invents requirements.",
  },
  {
    label: "03 — Roadmap",
    title: "One sequenced plan",
    body: "Every step with realistic timelines, held in your dashboard and exportable as a board-quality PDF.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-16 px-8 pt-16 pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:pt-24">
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-3 text-xs tracking-[0.22em] text-gold uppercase">
            <span className="h-px w-8 bg-gold" />
            For internationally trained dentists
          </div>
          <h1 className="text-balance font-heading text-[42px] leading-[1.08] font-semibold tracking-[-0.02em] sm:text-[58px] sm:leading-[1.06]">
            Your UK dental career, precisely mapped.
          </h1>
          <p className="max-w-[520px] text-pretty text-lg leading-[1.65] text-mut">
            GDC. ORE. OET. Visas. We distil the regulatory maze into one
            sequenced, personal roadmap — drawn from a verified knowledge
            base and written in plain English.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <Link href="/signup" className={buttonVariants({ size: "cta" })}>
              Begin your assessment
            </Link>
            <Link
              href="#sample-engagement"
              className={buttonVariants({ size: "cta", variant: "outline" })}
            >
              View a sample roadmap
            </Link>
          </div>
          <p className="mt-2 text-[13px] text-mut">
            Six questions. Three minutes. One roadmap.
          </p>
        </div>

        <div
          id="sample-engagement"
          className="scroll-mt-24 border border-line bg-surface p-8"
        >
          <div className="flex items-baseline justify-between gap-3 border-b border-line pb-5">
            <div className="font-heading text-[15px] font-semibold">
              Sample engagement
            </div>
            <div className="text-[11px] tracking-[0.16em] text-gold uppercase">
              28–62 weeks
            </div>
          </div>
          <div className="flex flex-col">
            {SAMPLE_STEPS.map((step, i) => (
              <div
                key={step.num}
                className={
                  "flex gap-5 py-5" +
                  (i < SAMPLE_STEPS.length - 1 ? " border-b border-line" : " pb-0")
                }
              >
                <div className="pt-0.5 font-heading text-[13px] text-gold">
                  {step.num}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-[15px] font-medium">{step.title}</div>
                  <div className="text-[13px] text-mut">{step.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-[1200px] px-8 py-20">
          <div className="mb-10 text-xs tracking-[0.22em] text-gold uppercase">
            How an engagement works
          </div>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            {PROCESS.map((p) => (
              <div
                key={p.label}
                className="flex flex-col gap-3.5 border-t border-line-strong pt-6"
              >
                <div className="font-heading text-sm text-gold">{p.label}</div>
                <div className="font-heading text-[21px] font-semibold">
                  {p.title}
                </div>
                <p className="text-pretty text-[15px] leading-[1.6] text-mut">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 px-8 py-14 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[640px] text-pretty text-base leading-[1.6]">
            Every requirement in your plan is traced to GDC, UKVI and NHS
            sources, and flagged until reviewed by subject-matter experts.
          </p>
          <Link
            href="/signup"
            className={buttonVariants({
              size: "form",
              variant: "ghost-gold",
              className: "shrink-0",
            })}
          >
            Start now
          </Link>
        </div>
      </section>

      <footer className="border-t border-line bg-background">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 px-8 py-10 sm:flex-row sm:justify-between">
          <BrandMark variant="footer" />
          <p className="max-w-[560px] text-pretty text-[12.5px] leading-[1.6] text-mut">
            DentalBridge is an informational planning tool, not a substitute
            for official guidance from the GDC, UKVI, or your dental defence
            organisation. Always verify requirements against official
            sources before making decisions.
          </p>
        </div>
      </footer>
    </main>
  );
}
