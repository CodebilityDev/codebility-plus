import { z } from "zod";

// Validation schema
export const SignupFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email_address: z.string().email("Please enter a valid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  about: z.string().optional(),
  portfolio_website: z.string().url().optional().or(z.literal("")),
  positions: z.array(z.object({ id: z.number(), name: z.string() })).min(1, "Please select at least one position"),
  tech_stacks: z.array(z.string()).min(1, "Please select at least one tech stack"),
  years_of_experience: z.number().min(0, "Experience must be 0 or more years"),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  username: z.string().min(8, "Username must be at least 8 characters").optional(),
  discord: z.string().optional(),
  privacyPolicy: z.boolean().refine(val => val === true, "You must agree to the Privacy Policy"),
  ndaAgreement: z.boolean().refine(val => val === true, "You must agree to the Non-Disclosure Agreement"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
