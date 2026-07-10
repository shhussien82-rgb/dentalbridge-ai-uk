export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[760px] px-8 py-18">
        <div className="flex flex-col gap-1.5 border-b border-line-strong pb-7">
          <div className="text-[11px] tracking-[0.2em] text-gold uppercase">
            Legal
          </div>
          <h1 className="font-heading text-[34px] font-semibold">
            Privacy policy
          </h1>
        </div>

        <div className="flex flex-col gap-6 pt-8 text-[14.5px] leading-[1.65] text-mut">
          <p>
            This policy explains what data DentalBridge collects and how
            it&apos;s used to generate your personalized UK dental career
            roadmap.
          </p>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-lg font-semibold text-ink">
              1. What we collect
            </h2>
            <p>
              Account details (email, and profile info if you sign in with
              Google), and the answers you give in the questionnaire —
              country of graduation, GDC/ORE status, English test progress,
              and employment preferences. This is stored in our database
              (Supabase) and used to generate and save your plan.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-lg font-semibold text-ink">
              2. How it&apos;s used
            </h2>
            <p>
              Your questionnaire answers are matched against a rules engine
              to select the relevant pathway steps, then passed to the
              Claude API to narrate the plan in plain English. Your data is
              not sold or used to train third-party models beyond that
              single narration call.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-lg font-semibold text-ink">
              3. Storage &amp; retention
            </h2>
            <p>
              Data is stored with Supabase (Postgres) and retained for as
              long as your account is active, so you can revisit past plans
              from your dashboard. You can request deletion at any time via
              the contact page.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-lg font-semibold text-ink">
              4. Third parties
            </h2>
            <p>
              We use Supabase for authentication and data storage, and the
              Claude API (Anthropic) to narrate generated plans. Google
              OAuth is used only if you choose &quot;Continue with
              Google&quot;.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-lg font-semibold text-ink">
              5. Your rights
            </h2>
            <p>
              You can request access to, correction of, or deletion of your
              data at any time by contacting us.
            </p>
          </section>

          <p className="text-[13px]">
            Questions about this policy? Reach us via the{" "}
            <a href="/contact" className="border-b border-gold text-gold">
              contact page
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
