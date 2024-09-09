import { z } from "zod"; 

export const manageProfileFormSchema = z.object({
    displayName: z.string().min(1),
    coverPhoto: z.string().min(1),
    businessEmail: z.string().min(1),
    businessContact: z.string().min(1),
    businessIndustry: z.string().min(1),
    industryRole: z.string().min(1),
    bio: z.string().min(8),
})

export type ManageProfileData = z.infer<typeof manageProfileFormSchema>;