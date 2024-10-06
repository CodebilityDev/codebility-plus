import { useEffect, useState } from "react"
import { Button } from "./ui/button"


interface CodeResendProps {
  onResend: () => Promise<void>;
}

const RESEND_TIMER = 5

export default function CodeResend({onResend}:CodeResendProps) {

  const [resendTimer, setResendTimer]  = useState(RESEND_TIMER)
  const [loading, setLoading] = useState(false)

  const resendCode = async () => {
    try {
      setLoading(true)
      await onResend()
      setResendTimer(10)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (resendTimer === 0) return;
    const timeout = setTimeout(() => {
      setResendTimer(t => t - 1)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [resendTimer])

  return (
    <div className="flex flex-row items-center gap-x-2 text-sm">
      <p className="text-custom-text/50 text-sm">Did not receive code ?&nbsp;
      <Button
      disabled={resendTimer > 0 || loading}
      variant={"link"} 
      size={"link"} 
      onClick={resendCode}>
        {
          resendTimer === 0 ?
          "Resend." :
          `Resend in ${resendTimer} seconds.`
        }
      </Button>
      </p>
      
    </div>
  )
}