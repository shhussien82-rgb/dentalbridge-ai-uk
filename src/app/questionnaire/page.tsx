"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuestionnairePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
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

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-bold">Tell us about your background</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This takes about 3 minutes. We use it to build your personalized
        roadmap — nothing here is shared publicly.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Background</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country_of_graduation">Country where you graduated</Label>
              <Input id="country_of_graduation" {...register("country_of_graduation")} />
              {errors.country_of_graduation && (
                <p className="text-sm text-destructive">
                  {errors.country_of_graduation.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="years_experience">Years of clinical experience</Label>
                <Input
                  id="years_experience"
                  type="number"
                  {...register("years_experience")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">English test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                name="english_test_status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Not booked yet</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {englishStatus !== "none" && (
              <>
                <div className="space-y-2">
                  <Label>Which test?</Label>
                  <Controller
                    name="english_test_type"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select test" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OET">OET</SelectItem>
                          <SelectItem value="IELTS">IELTS</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.english_test_type && (
                    <p className="text-sm text-destructive">
                      {errors.english_test_type.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="english_score">Score (optional)</Label>
                  <Input id="english_score" {...register("english_score")} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">GDC &amp; ORE status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>GDC registration status</Label>
              <Controller
                name="gdc_status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No GDC registration</SelectItem>
                      <SelectItem value="provisional">Provisional</SelectItem>
                      <SelectItem value="full">Full registration</SelectItem>
                      <SelectItem value="lapsed">Lapsed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>ORE progress</Label>
              <Controller
                name="ore_status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select progress" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_started">Not started</SelectItem>
                      <SelectItem value="part1_passed">Part 1 passed</SelectItem>
                      <SelectItem value="part1_failed">Part 1 not passed yet</SelectItem>
                      <SelectItem value="part2_passed">Part 2 passed</SelectItem>
                      <SelectItem value="exempt">Exempt from ORE</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Job preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>NHS or private?</Label>
              <Controller
                name="nhs_or_private_preference"
                control={control}
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="nhs" id="pref-nhs" />
                      <Label htmlFor="pref-nhs" className="font-normal">NHS</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="private" id="pref-private" />
                      <Label htmlFor="pref-private" className="font-normal">Private</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="either" id="pref-either" />
                      <Label htmlFor="pref-either" className="font-normal">Either</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <Controller
                name="wants_visa_sponsorship"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="wants_visa_sponsorship"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="wants_visa_sponsorship" className="font-normal">
                I will need visa sponsorship to work in the UK
              </Label>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Building your plan..." : "Generate my plan"}
        </Button>
      </form>
    </main>
  );
}
