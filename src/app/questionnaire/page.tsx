"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  profileFormSchema,
  type ProfileFormInput,
  type ProfileFormValues,
} from "@/lib/schemas/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TileGroup } from "@/components/tile-group";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Background", desc: "Qualification & experience" },
  { title: "English test", desc: "OET or IELTS status" },
  { title: "GDC & ORE", desc: "Registration & exam progress" },
  { title: "Preferences", desc: "NHS, private, visa" },
];

const STEP_FIELDS: (keyof ProfileFormInput)[][] = [
  ["country_of_graduation", "graduation_year", "years_experience"],
  ["english_test_status", "english_test_type", "english_score"],
  ["gdc_status", "ore_status"],
  ["nhs_or_private_preference", "wants_visa_sponsorship"],
];

const ENGLISH_STATUS_OPTIONS = [
  { value: "none", label: "Not booked yet" },
  { value: "booked", label: "Booked" },
  { value: "passed", label: "Passed" },
];

const ENGLISH_TYPE_OPTIONS = [
  { value: "OET", label: "OET" },
  { value: "IELTS", label: "IELTS" },
];

const GDC_OPTIONS = [
  { value: "none", label: "No GDC registration" },
  { value: "provisional", label: "Provisional" },
  { value: "full", label: "Full registration" },
  { value: "lapsed", label: "Lapsed" },
];

const ORE_OPTIONS = [
  { value: "not_started", label: "Not started" },
  { value: "part1_passed", label: "Part 1 passed" },
  { value: "part1_failed", label: "Part 1 not passed yet" },
  { value: "part2_passed", label: "Part 2 passed" },
  { value: "exempt", label: "Exempt from ORE" },
];

const PREF_OPTIONS = [
  { value: "nhs", label: "NHS" },
  { value: "private", label: "Private" },
  { value: "either", label: "Either" },
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ProfileFormInput, unknown, ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      years_experience: 0,
      english_test_status: "none",
      ore_status: "not_started",
      gdc_status: "none",
      nhs_or_private_preference: "either",
      wants_visa_sponsorship: false,
    },
  });

  const englishStatus = watch("english_test_status");

  async function onSubmit(values: ProfileFormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong generating your plan.");
        setSubmitting(false);
        return;
      }
      router.push(`/results/${data.planId}`);
    } catch {
      toast.error("Network error — please try again.");
      setSubmitting(false);
    }
  }

  function onInvalid(errs: FieldErrors<ProfileFormInput>) {
    const stepIdx = STEP_FIELDS.findIndex((fields) =>
      fields.some((f) => f in errs)
    );
    if (stepIdx !== -1) setStep(stepIdx);
    toast.error("Please complete the highlighted fields.");
  }

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  const isLastStep = step === STEPS.length - 1;

  return (
    <main className="flex-1">
      <div className="mx-auto grid max-w-[1080px] grid-cols-1 gap-10 px-8 py-14 lg:grid-cols-[300px_1fr] lg:gap-18 lg:py-18">
        <div className="flex flex-col gap-2 lg:sticky lg:top-26 lg:self-start">
          <div className="mb-4 text-[11px] tracking-[0.2em] text-gold uppercase">
            Assessment · Step {step + 1} of {STEPS.length}
          </div>
          {STEPS.map((s, i) => {
            const active = step === i;
            const done = step > i;
            return (
              <div
                key={s.title}
                onClick={() => setStep(i)}
                className={cn(
                  "flex cursor-pointer gap-4 border-l-2 p-3.5",
                  active ? "border-gold bg-gold-soft" : "border-line"
                )}
              >
                <div
                  className={cn(
                    "pt-0.5 font-heading text-[13px]",
                    active || done ? "text-gold" : "text-mut"
                  )}
                >
                  {done ? "✓" : "0" + (i + 1)}
                </div>
                <div className="flex flex-col gap-0.5">
                  <div
                    className={cn(
                      "text-[15px]",
                      active ? "font-semibold text-ink" : "font-medium text-mut"
                    )}
                  >
                    {s.title}
                  </div>
                  <div className="text-[12.5px] text-mut">{s.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="flex min-h-[380px] flex-col border border-line bg-surface p-10"
        >
          <div className="flex flex-1 flex-col gap-7">
            {step === 0 && (
              <>
                <div className="flex flex-col gap-2">
                  <div className="font-heading text-2xl font-semibold">
                    Your background
                  </div>
                  <p className="text-sm text-mut">
                    Nothing here is shared publicly — it shapes your roadmap
                    only.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="country_of_graduation">
                    Country where you graduated
                  </Label>
                  <Input
                    id="country_of_graduation"
                    {...register("country_of_graduation")}
                  />
                  {errors.country_of_graduation && (
                    <p className="text-sm text-destructive">
                      {errors.country_of_graduation.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="graduation_year">Graduation year</Label>
                    <Input
                      id="graduation_year"
                      type="number"
                      {...register("graduation_year")}
                    />
                    {errors.graduation_year && (
                      <p className="text-sm text-destructive">
                        {errors.graduation_year.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="years_experience">
                      Years of clinical experience
                    </Label>
                    <Input
                      id="years_experience"
                      type="number"
                      {...register("years_experience")}
                    />
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="flex flex-col gap-2">
                  <div className="font-heading text-2xl font-semibold">
                    English test
                  </div>
                  <p className="text-sm text-mut">
                    OET (dentistry) or IELTS Academic both satisfy the GDC.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <Controller
                    name="english_test_status"
                    control={control}
                    render={({ field }) => (
                      <TileGroup
                        columns={3}
                        options={ENGLISH_STATUS_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                {englishStatus !== "none" && (
                  <>
                    <div className="flex flex-col gap-2">
                      <Label>Which test?</Label>
                      <Controller
                        name="english_test_type"
                        control={control}
                        render={({ field }) => (
                          <TileGroup
                            columns={2}
                            options={ENGLISH_TYPE_OPTIONS}
                            value={field.value ?? undefined}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      {errors.english_test_type && (
                        <p className="text-sm text-destructive">
                          {errors.english_test_type.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="english_score">
                        Score, if taken (optional)
                      </Label>
                      <Input id="english_score" {...register("english_score")} />
                    </div>
                  </>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <div className="flex flex-col gap-2">
                  <div className="font-heading text-2xl font-semibold">
                    GDC &amp; ORE status
                  </div>
                  <p className="text-sm text-mut">
                    Where you are with registration and the Overseas
                    Registration Exam.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>GDC registration</Label>
                  <Controller
                    name="gdc_status"
                    control={control}
                    render={({ field }) => (
                      <TileGroup
                        columns={2}
                        options={GDC_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>ORE progress</Label>
                  <Controller
                    name="ore_status"
                    control={control}
                    render={({ field }) => (
                      <TileGroup
                        columns={2}
                        options={ORE_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="flex flex-col gap-2">
                  <div className="font-heading text-2xl font-semibold">
                    Preferences
                  </div>
                  <p className="text-sm text-mut">
                    This shapes the employment stage of your roadmap.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>NHS or private practice?</Label>
                  <Controller
                    name="nhs_or_private_preference"
                    control={control}
                    render={({ field }) => (
                      <TileGroup
                        columns={3}
                        options={PREF_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <Controller
                  name="wants_visa_sponsorship"
                  control={control}
                  render={({ field }) => (
                    <label
                      htmlFor="wants_visa_sponsorship"
                      className="flex cursor-pointer items-center gap-3 border border-line-strong p-4"
                    >
                      <Checkbox
                        id="wants_visa_sponsorship"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-[14.5px] font-normal normal-case tracking-normal text-foreground">
                        I will need visa sponsorship to work in the UK
                      </span>
                    </label>
                  )}
                />
              </>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-line pt-3">
            <Button
              type="button"
              variant="outline"
              size="form"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
              className={step === 0 ? "pointer-events-none opacity-40" : ""}
            >
              Back
            </Button>
            {isLastStep ? (
              <Button key="submit" type="submit" size="form" disabled={submitting}>
                {submitting ? "Building your plan..." : "Generate my roadmap"}
              </Button>
            ) : (
              <Button key="continue" type="button" size="form" onClick={goNext}>
                Continue
              </Button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
