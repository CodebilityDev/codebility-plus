"use server"
import { cookies } from "next/headers"

export async function getToken() {
  const allCookies = await cookies()
  const authCookie = allCookies.get("codebility-auth")
  if (!authCookie) return null

  return authCookie?.value as string
}
