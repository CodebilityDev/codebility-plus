"use client"

import { useEffect, useState } from "react"
import Loader from "@/Components/shared/Loader"
import Index from "@/app/(home)/index/Index"

export default function Web() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(async () => {
        setIsLoading(false)
      }, 1000)
    }

    fetchData()
  }, [])

  return (
    <>
      {isLoading ? (
        <Loader className="flex h-screen flex-col items-center justify-center gap-10 bg-black-400" />
      ) : (
        <Index />
      )}
    </>
  )
}
