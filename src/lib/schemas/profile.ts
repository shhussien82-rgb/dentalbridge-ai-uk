import { z } from "zod";

export const profileFormSchema = z
  .object({
    country_of_graduation: z.string().trim().min(2, "Required"),
    graduation_year: z.coerce
      .number()
      .int()
      .min(1970)
      .max(new Date().getFullYear()),
    years_experience: z.coerce.number().int().min(0).max(60),
    english_test_status: z.enum(["none", "booked", "passed"]),
    english_test_type: z.enum(["OET", "IELTS"]).optional(),
    english_score: z.string().trim().optional(),
    ore_status: z.enum([
      "not_started",
      "part1_passed",
      "part1_failed",
      "part2_passed",
      "exempt",
    ]),
    gdc_status: z.enum(["none", "provisional", "full", "lapsed"]),
    nhs_or_private_preference: z.enum(["nhs", "private", "either"]),
    wants_visa_sponsorship: z.boolean(),
  })
  .refine(
    (data) => data.english_test_status === "none" || !!data.english_test_type,
    {
      message: "Select which test (OET or IELTS) once you've booked or passed one",
      path: ["english_test_type"],
    }
  );

// Input = raw values as the form holds them before zod's coercions run
// (e.g. graduation_year as the user typed it); Output = validated/coerced
// values (e.g. graduation_year as a number). react-hook-form needs both when
// a resolver schema uses z.coerce — see questionnaire/page.tsx.
export type ProfileFormInput = z.input<typeof profileFormSchema>;
export type ProfileFormValues = z.output<typeof profileFormSchema>;
