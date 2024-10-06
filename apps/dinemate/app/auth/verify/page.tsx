"use client"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { ArrowLeft } from "lucide-react"
import CodeResend from "@/components/CodeResend"
import { useRouter } from "next/navigation"

export default function VerifyPage() {
  const router = useRouter()

  const handleConfirm = () => {
    router.replace('/auth/success')
  }
  return (
    <div className="flex justify-center">
      <main className="w-full max-w-[360px] flex flex-col gap-y-6">
        <Button 
        variant={"ghost"} 
        size={"icon"} 
        className="hover:bg-transparent hover:border hover:border-custom-gray rounded-full"
        onClick={() => router.back()}
        >
          <ArrowLeft className="stroke-custom-gray" size={24} />
        </Button>
        <div>
          <h1 className="font-[900] text-2xl text-custom-accent">Verification Code</h1>
          <p className="text-custom-gray">Please check your inbox for the OTP.</p>
        </div>
        <div className="w-full">
          <InputOTP maxLength={4}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>      
          </InputOTP>
        </div>
        <CodeResend onResend={async () => {}} />
        <Button className="h-14 text-base" onClick={handleConfirm}>Confirm</Button>
      </main>
    </div>
  )
}