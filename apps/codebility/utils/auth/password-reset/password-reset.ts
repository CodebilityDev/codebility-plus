import { z } from "zod";

/* import { createClientClientComponent } from "@/lib/global/supabase-client"; */

// Define the schema for email validation
export const EmailValidation = z.object({
  email: z.string().email("Invalid email address"),
});
