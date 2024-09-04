import * as z from "zod"

export const serviceCategorySchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, { message: "Service category name is required" }),
})
  
export type serviceCategoryFormValues = z.infer<typeof serviceCategorySchema>