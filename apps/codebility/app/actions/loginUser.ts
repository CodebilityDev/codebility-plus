"use server"

import { cookies } from "next/headers"
import { loginUser } from "@/app/api/auth"
import { FieldValues } from "react-hook-form"
import { getApplicants } from "@/app/api/applicants"

export async function loginUserAction(data: FieldValues) {
  const applicants: any = await getApplicants()
  if (applicants && applicants.data) {
    const matchedApplicants = applicants?.data.some((item: any) => {
      if (item.email_address === data.email) return true
    })
    if (matchedApplicants) {
      return { type: "applicant", success: true, message: "Applicants Waiting to be approved" }
    }
  }
  const user: any = await loginUser(data)
  if (user && user.data) {
    cookies().set({
      name: "codebility-auth",
      value: user.data.token,
      httpOnly: true,
      secure: true,
      path: "/",
    })
    return { type: "all", success: true, message: "Logged In" }
  }
}
