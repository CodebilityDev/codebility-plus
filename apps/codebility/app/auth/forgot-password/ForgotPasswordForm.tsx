
"use client"

import { z } from "zod"
import Link from "next/link"
import { useState } from "react"

import InputEmail from "@/app/auth/InputEmail"
import { Button } from "@/Components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { EmailValidation } from "@/lib/validations/auth"
import { useToast, ToastTypes } from "@/hooks/useToast"
import { forgotPassword } from "@/app/actions/forgotPassword"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"

type Inputs = z.infer<typeof EmailValidation>

const ForgotPasswordForm = () => {
  const [isLoading, setisLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { Toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(EmailValidation),
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setisLoading(true)

    const result: any = await forgotPassword(data)

    if (!result.success) {
      Toast("Failed to send reset password email. Please try again later.")
      setisLoading(false)
      return null
    }

    if (result?.success) {
      Toast(result.message, ToastTypes.SUCCESS)
      setIsSubmitted(true)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-lg font-semibold lg:text-xl">Forgot Password</p>

      {isSubmitted ? (
        <div className="mx-auto flex w-full flex-col items-center gap-8 py-10">
          <h1 className="max-w-[266px] text-center text-xl font-light">
            Please check your email inbox to reset your password.
          </h1>
          <Link href="/">
            <Button className="text-sm font-light">Go to Homepage</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-8 py-10">
            <InputEmail
              id="email"
              label="Email"
              register={register}
              errors={errors}
              disabled={isLoading}
              type="email"
            />
            <Button type="submit" variant="default" className="w-max self-end py-3 text-sm" disabled={isLoading}>
              Send Request
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ForgotPasswordForm
