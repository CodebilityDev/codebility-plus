import z from "zod";

export const applicantSchema = z.object({
    id: z.string(),
    test_taken: z.string().datetime({ offset: true }).nullable(),
    fork_url: z.string().nullable(),
    created_at: z.string().datetime({ offset: true }),
    updated_at: z.string().datetime({ offset: true }),
})

export type ApplicantType = z.infer<typeof applicantSchema>;
