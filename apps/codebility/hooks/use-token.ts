"use client"

import { getToken } from "@/lib/token"
import { useEffect, useState } from "react"

type tokenState = {
  status: "loading" | "unauthenticated" | "authenticated"
  token: any | null
}

function useToken() {
  const [token, setToken] = useState<tokenState>({
    status: "loading",
    token: null,
  })
  useEffect(() => {
    async function newC() {
      const tokenAuth = await getToken()
      if (!tokenAuth) {
        setToken((prev) => ({
          ...prev,
          status: "unauthenticated",
          token: null,
        }))
        return null
      }
      setToken((prev) => ({
        ...prev,
        status: "authenticated",
        token: tokenAuth,
      }))
    }
    newC()
  }, [])
  return token
}

export default useToken
