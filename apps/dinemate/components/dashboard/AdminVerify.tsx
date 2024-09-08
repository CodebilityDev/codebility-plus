"use client"
// import { adminService } from "@/modules"
import { useToast } from "~/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminVerify() {
  const {toast} = useToast()
  const router = useRouter()

  const handleVerifyAdminCode = async () => {
    // const s = await adminService.adminVerify()
    const s = 200
    if (s === 200) {
      console.log("handleVerifyAdminCode verified")
    } else if (s === 400 || s === 404) {
      toast({
        title: "Invalid admin authentication code",
        variant: "destructive"
      })
      console.log("handleVerifyAdminCode not verified")
      router.replace("/admin/login")
    }
    console.log("error while verifying code")
  }

  useEffect(() => {
    handleVerifyAdminCode()
  }, [])

  return (
    <></>
  )
}