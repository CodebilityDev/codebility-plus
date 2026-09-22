import z from "zod";

export const onboardingVideoSchema = z.object({
  id: z.string(),
  applicant_id: z.string(),
  video_number: z.number().min(1).max(4),
  completed: z.boolean(),
  watched_duration: z.number().default(0),
  total_duration: z.number().default(0),
  completed_at: z.string().datetime({ offset: true }).nullable(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export type OnboardingVideoType = z.infer<typeof onboardingVideoSchema>;

export const onboardingProgressSchema = z.object({
  video1: z.boolean().default(false),
  video2: z.boolean().default(false),
  video3: z.boolean().default(false),
  video4: z.boolean().default(false),
  currentVideo: z.number().min(1).max(4).default(1),
});

export type OnboardingProgressType = z.infer<typeof onboardingProgressSchema>;
