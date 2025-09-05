"use client"
import { getCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { useLayoutEffect, useState } from "react"
import Loading from "./Loading"


export default function SessionChecker() {
  const router = useRouter()
  const [hasSession, setHasSession] = useState(false)

  useLayoutEffect(() => {
    const session = getCookie("session")
    if (!session) {
      router.replace("/auth/qr-scanner")
    } else {
      setHasSession(true)
    }
  }, [])

  if (!hasSession) {
    <Loading />
  }

  return (
    <></>
  )
}