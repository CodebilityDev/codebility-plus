"use server"

import { FieldValues } from "react-hook-form"
import { getPasswordReset } from "@/app/api/auth"

export async function PasswordResets(data: FieldValues, token: any) {
  const getPasswordResets: any = getPasswordReset(data, token)

  if (!getPasswordResets) {
    return { success: false, message: "Failed to reset password. Please try again later." }
  }

  return { success: true, message: "Password has ben reset" }
}
