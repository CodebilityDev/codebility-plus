import { z } from "zod";

// Define the validation schema for user information
export const UserInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});
