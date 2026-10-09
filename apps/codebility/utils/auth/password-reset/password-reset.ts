import { z } from "zod";

// Define the schema for email validation
export const EmailValidation = z.object({
  email: z.string().email("Invalid email address"),
});