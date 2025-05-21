import z from 'zod';

export const newApplicantsSchema = z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    email_address: z.string(),
    phone_number: z.string().nullable(),
    address: z.string().nullable(),
    about: z.string().nullable(),
    positions: z.array(z.string()).nullable(),
    display_position: z.string().nullable(),
    portfolio_website: z.string().nullable(),
    tech_stacks: z.array(z.string()),
    image_url: z.string().nullable(),
    availability_status: z.boolean(),
    nda_status: z.boolean().nullable(),
    level: z.record(z.any()).nullable(),
    application_status: z.string(),
    rejected_count: z.number(),
    facebook: z.string().nullable(),
    linkedin: z.string().nullable(),
    github: z.string().nullable(),
    discord: z.string().nullable(),
    years_of_experience: z.number(),
    role_id: z.number(),
    internal_status: z.string(),
    mentor_id: z.string().nullable(),
    nda_signature: z.string().nullable(),
    nda_document: z.string().nullable(),
    nda_signed_at: z.string().nullable(),
    nda_request_sent: z.boolean().nullable(),
    date_applied: z.string().datetime({ offset: true }).nullable(),
    applicant: z.object({
        id: z.string(),
        codev_id: z.string(),
        test_taken: z.string().datetime({ offset: true }).nullable(),
        fork_url: z.string().nullable(),
        created_at: z.string().datetime({ offset: true }),
        updated_at: z.string().datetime({ offset: true }),
    }).nullable(),
    created_at: z.string().datetime({ local: true }),
    updated_at: z.string().datetime({ local: true }),
})

export type NewApplicantType = z.infer<typeof newApplicantsSchema>

export type ExperienceRanges = {
  novice: boolean; // 0-2 years
  intermediate: boolean; // 3-5 years
  expert: boolean; // 5+ years
};