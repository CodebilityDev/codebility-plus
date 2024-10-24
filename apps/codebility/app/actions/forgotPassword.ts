"use server";

import { getEmailForgotPassword } from "@/app/api/auth";
import { FieldValues } from "react-hook-form";

export async function forgotPassword(data: FieldValues) {
  const forgotPasswordEmail = await getEmailForgotPassword(data);

  if (!forgotPasswordEmail) {
    return {
      success: false,
      message: "Failed to send reset password email. Please try again later.",
    };
  }

  return { success: true, message: "Email reset password link has been sent" };
}
