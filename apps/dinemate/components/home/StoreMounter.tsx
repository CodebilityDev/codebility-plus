"use client"
import { useEffect } from "react"
import { useStore } from "~/hooks/useStore"
import { updateSessionData } from "~/lib/verifyAuthCode"

export default function StoreMounter() {
 

  const updateSession = useStore(s => s.updateSession)
  const session = useStore(s => s.session)

  

 
  useEffect(() => {
    // updates the session state every 15 min
    updateSession()
    const interval = setInterval(async() => {
      await updateSessionData()
      updateSession()
    }, 7_500)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    console.log("session", session)
  }, [session])
  
  

  return <></>
}