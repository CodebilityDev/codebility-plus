"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Reloader() {
  const router =  useRouter()

  useEffect(() => {
    const i = setInterval(() => {
      console.log("refreshing page...")
      router.refresh()
    }, 5_000)
    return () => clearInterval(i)
  }, [])

  return (
    <></>
  )
}