import type { onboardingVideoSchema, onboardingProgressSchema } from "@/utils/applicant/onboarding/onboarding";
import type z from "zod";

export type OnboardingVideoType = z.infer<typeof onboardingVideoSchema>;

export type OnboardingProgressType = z.infer<typeof onboardingProgressSchema>;
