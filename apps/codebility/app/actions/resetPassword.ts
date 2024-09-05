"use server";

import { getPasswordReset } from "@/app/api/auth";
import { FieldValues } from "react-hook-form";

export async function PasswordResets(data: FieldValues, token: any) {
  const getPasswordResets: any = getPasswordReset(data, token);

  if (!getPasswordResets) {
    return {
      success: false,
      message: "Failed to reset password. Please try again later.",
    };
  }

  return { success: true, message: "Password has ben reset" };
}
