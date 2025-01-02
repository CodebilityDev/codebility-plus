import { z } from "zod";

export const accountSettingsEmailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const userDeletionSchema = z.object({
  confirmation: z
    .string()
    .trim()
    .min(1, { message: "Please type DELETE to confirm account deletion" })
    .refine((val) => val === "" || val === "DELETE", {
      message: "Please type DELETE to confirm account deletion",
    }),
});
