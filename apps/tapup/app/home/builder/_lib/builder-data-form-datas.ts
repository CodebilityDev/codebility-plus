import { z } from "zod"; 

export const profileFormSchema = z.object({
    name: z.string().min(1),
    coverPhoto: z.string().min(1),
    businessEmail: z.string().min(8),
    businessContact: z.string().min(8),
    businessIndustry: z.string().min(8),
    industryRole: z.string().min(8),
    bio: z.string().min(8),
})

export type ProfileData = z.infer<typeof profileFormSchema>;

export const profileDatasDefault: ProfileData = {
    name: 'Highland Bali',
    coverPhoto: '',
    businessEmail: '',
    businessContact: '',
    businessIndustry: 'Telecommunication',
    industryRole: 'CEO',
    bio: 'A ball is a round object (usually spherical, but can sometimes be ovoid) with several uses. It is used in ball games, where the play of the game follows the state of the ball as it is hit, kicked or thrown by players',
}
