"use server"
import { cookies } from "next/headers"
import { jwtDecode } from "jwt-decode"

export async function getCookies(cookieName: string) {
  const allCookies = await cookies()
  const authCookie = allCookies.get(cookieName)
  if (!authCookie) return null

  return jwtDecode(authCookie?.value as string)
}
