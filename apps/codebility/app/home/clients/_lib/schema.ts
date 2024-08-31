import * as z from "zod"

export const clientSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email().optional(),
    location: z.string().optional(),
    contact_number: z.string().optional(),
    linkedin_link: z.string().url().optional(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    logo: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>
