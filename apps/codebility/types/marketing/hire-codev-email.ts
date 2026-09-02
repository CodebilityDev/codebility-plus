import { z } from "zod";

export const hireCodevEmailSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  message: z.string().min(1, { message: "Message is required" }),
});

export type HireCodevEmail = z.infer<typeof hireCodevEmailSchema>;
