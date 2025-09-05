"use client"

import { useLayoutEffect } from "react"

export default function BgHandler() {

  useLayoutEffect(() => {
    document.body.style.backgroundColor = "#DFE2E6"

    return () => {
      document.body.style.backgroundColor = "transparent"
    }
  }, [])

  return <></>
}