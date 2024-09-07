"use client"
import { useEffect } from "react"
import { revalidate } from "~/lib/revalidate"

export default function AssistRefresher() {

  useEffect(() => {
    let interval = setInterval(() => {
      console.log("refreshing assits list...")
      revalidate("/dashboard/assist")
    }, 5_000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <></>
  )
}