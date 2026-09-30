import { z } from "zod";

export const serviceWriteSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  duration: z.string().min(1, "Duration is required"),
  features: z.array(z.string().min(1)).min(1, "At least one feature is required"),
  category: z.string().min(1, "Category is required"),
  is_active: z.boolean(),
});