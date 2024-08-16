import { z } from "zod"
import { useState } from "react"
import { useParams } from "next/navigation"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"

import { Button } from "@/Components/ui/button"
import InputPassword from "@/app/auth/InputPassword" 
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast, ToastTypes } from "@/hooks/useToast"
import { PasswordValidation } from "@/lib/validations/auth"
import { PasswordResets } from "@/app/actions/resetPassword"

type Inputs = z.infer<typeof PasswordValidation>

const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { Toast } = useToast()

  const { token } = useParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(PasswordValidation),
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)

    const result = await PasswordResets(data, token)

    if (!result.success) {
      setIsLoading(false)
      Toast(result.message, ToastTypes.ERROR)
      return
    }
    Toast(result.message, ToastTypes.SUCCESS)
  }

  return (
    <div className="flex flex-col gap-4 ">
      <p className="text-md text-center">Reset Password</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-8 py-10">
          <InputPassword
            id="password"
            label="Enter your new Password"
            placeholder="Enter your new Password"
            register={register}
            errors={errors}
            disabled={isLoading}
            type="password"
          />
        </div>
        <div className="mt-8 flex">
          <Button type="submit" variant="default" className="text-md w-full py-3 font-normal" disabled={isLoading}>
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ResetPasswordForm
