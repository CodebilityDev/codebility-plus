import { z } from "zod";

export const userDeletionSchema = z.object({
  confirmation: z.string().refine((val) => val === "DELETE", {
    message: "Please type DELETE to confirm",
  }),
});

export const emailChangeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
