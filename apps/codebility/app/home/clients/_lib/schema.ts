import * as z from "zod";

const fileSchema = z.custom<File>((val) => val instanceof File, {
  message: "Must be a File object",
});

export const clientSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.union([z.string().email(), z.literal("")]),
  location: z.string().optional(),
  contact_number: z.string().optional(),
  linkedin_link: z.union([z.string().url(), z.literal("")]),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  logo: z.union([fileSchema, z.string()]).optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
