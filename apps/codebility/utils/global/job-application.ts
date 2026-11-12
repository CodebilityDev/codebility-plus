import { z } from "zod";

export const applicationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  linkedIn: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  portfolio: z
    .string()
    .url("Invalid portfolio URL")
    .optional()
    .or(z.literal("")),
  yearsOfExperience: z.string().min(1, "Years of experience is required"),
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters"),
  experience: z.string().min(20, "Please describe your relevant experience"),
  referredBy: z.string().optional(),
  resume: z.any().optional(),
});
