const CONTACT_EMAIL = "hello@dentalbridgeuk.com";

export default function ContactPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[760px] px-8 py-18">
        <div className="flex flex-col gap-1.5 border-b border-line-strong pb-7">
          <div className="text-[11px] tracking-[0.2em] text-gold uppercase">
            Get in touch
          </div>
          <h1 className="font-heading text-[34px] font-semibold">
            Contact us
          </h1>
        </div>

        <div className="flex flex-col gap-6 pt-8 text-[14.5px] leading-[1.65] text-mut">
          <p>
            Questions about your roadmap, a correction to suggest on a
            pathway step, or a data request under our{" "}
            <a href="/privacy" className="border-b border-gold text-gold">
              privacy policy
            </a>
            ? Email us and we&apos;ll get back to you.
          </p>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="w-fit border border-line-strong bg-surface px-7 py-4 font-heading text-lg font-semibold text-gold transition-colors hover:border-gold"
          >
            {CONTACT_EMAIL}
          </a>

          <p className="text-[13px]">
            DentalBridge is an informational planning tool and not a
            substitute for official guidance from the GDC, UKVI, or your
            dental defence organization.
          </p>
        </div>
      </div>
    </main>
  );
}
