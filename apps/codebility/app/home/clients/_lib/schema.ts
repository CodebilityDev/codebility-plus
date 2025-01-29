import * as z from "zod";

const fileSchema = z.custom<File>((val) => val instanceof File, {
  message: "Must be a File object",
});

export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.union([z.string().email("Invalid email"), z.literal("")]),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  website: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
  company_logo: z.union([fileSchema, z.string()]).optional(),
  status: z.string().optional(),
  industry: z.string().optional(),
  client_type: z.string().optional(),
  country: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
