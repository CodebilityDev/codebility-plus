import { z } from "zod";

export const applicantsSchema = z.object({
  id: z.string(),
  first_name: z.string().min(4, "First name is required"),
  last_name: z.string().min(4, "Last name is required"),
  email_address: z.string().email("Invalid email address"),
  github: z.string().optional().nullable(),
  portfolio_website: z.string().optional().nullable(),
  tech_stacks: z.string().optional(),
});

export type ApplicantsFormValues = z.infer<typeof applicantsSchema>;
