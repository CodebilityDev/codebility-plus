import { z } from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/Components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInValidation } from "@/lib/validations/auth"

import { loginUserAction } from "@/app/actions/loginUser"
import SignInInputs from "@/app/auth/signin/SigninInputs"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"

type Inputs = z.infer<typeof SignInValidation>

import { useToast, ToastTypes } from "@/hooks/useToast"

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { Toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(SignInValidation),
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)
    const result: any = await loginUserAction(data)
    if (!result || result.status === 500) {
      Toast("Invalid Credentials", ToastTypes.ERROR)
      setIsLoading(false)
      return null
    }
    if (result?.type === "all" && result?.success) {
      Toast("Successfully Logged In")
      router.push("/dashboard")
    } else if (result?.type === "applicant" && result?.success) {
      Toast(result?.message)
      router.push("/waiting")
    } else {
      setIsLoading(false)
      Toast("Invalid Credentials", ToastTypes.ERROR)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 py-3">
          <SignInInputs
            id="email_address"
            label="Email"
            placeholder="Enter your Email"
            register={register}
            errors={errors}
            disabled={isLoading}
            type="email"
          />
          <SignInInputs
            id="password"
            label="Password"
            placeholder="Enter your Password"
            register={register}
            errors={errors}
            disabled={isLoading}
            type="password"
          />
          <button
            type="button"
            onClick={() => router.push("/auth/forgot-password")}
            className="text-md text-right duration-300 hover:text-blue-100"
          >
            Forgot Password?
          </button>
          <Button type="submit" variant="default" className="text-md w-full py-3 font-normal" disabled={isLoading}>
            Sign In
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SignInForm
