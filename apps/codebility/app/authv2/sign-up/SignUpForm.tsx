"use client"

import { Checkbox } from "@codevs/ui/checkbox"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button, buttonVariants } from "@/Components/ui/button"
import { signupUser } from "../actions"
import { useModal } from "@/hooks/use-modal"
import { useTechStackStore } from "@/hooks/use-techstack"
import { useSchedule } from "@/hooks/use-timeavail"
import { SignUpValidation } from "@/lib/validations/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import SignUpInputs from "./SignupInputs"

type Inputs = z.infer<typeof SignUpValidation>
interface Field {
  id:
    | "firstName"
    | "lastName"
    | "email_address"
    | "techstack"
    | "facebook"
    | "website"
    | "password"
    | "confirmPassword"
    | "schedule"
    | "position"
  label: string
  placeholder: string
  type?: string
  optional?: boolean
}
interface FieldType {
  fields: Field[]
}

const steps: FieldType[] = [
  {
    fields: [
      { id: "firstName", label: "First name", placeholder: "Enter your First name", type: "text" },
      { id: "lastName", label: "Last name", placeholder: "Enter your Last name", type: "text" },
      { id: "techstack", label: "Tech Stack", placeholder: "Enter your tech stack", type: "text" },
      { id: "facebook", label: "Facebook", placeholder: "Enter your Facebook", type: "text" },
      { id: "website", label: "Website", placeholder: "Enter your website (Optional)", optional: true, type: "text" },
    ],
  },
  {
    fields: [
      { id: "email_address", label: "Email", placeholder: "Enter your Email", type: "email" },
      { id: "password", label: "Password", placeholder: "Password", type: "password" },
      { id: "confirmPassword", label: "Confirm password", placeholder: "Confirm Password", type: "password" },
      {
        id: "schedule",
        label: "Available time with us?",
        placeholder: "Select your available time with us",
        type: "text",
      },
      { id: "position", label: "Desired Position", placeholder: "Select your desired position", type: "dropdown" },
    ],
  },
]

const AuthForm = () => {
  const {
    register,
    handleSubmit,
    trigger,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(SignUpValidation),
  })
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { stack, clearStack } = useTechStackStore()
  const { time, clearTime } = useSchedule()
  const [isMounted, setIsMounted] = useState(false)

  const { onOpen } = useModal()

  const string = stack.map((item) => item).join(", ")
  const newTime = (time.start_time || time.end_time) && `${time.start_time} - ${time.end_time}`

  useEffect(() => {
    if (isMounted) {
      setValue("techstack", string)
      setValue("schedule", newTime)
    }
    setIsMounted(true)

    return () => {
      setIsMounted(false)
    }
  }, [string, newTime, isMounted, setValue])

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)
    try {
      console.log(data);
      await signupUser(data);

      clearTime()
      clearStack()
      reset()
      toast.success("Your account has been successfully created")
      router.push("/waiting")
    } catch (e) {
      setIsLoading(false)
      toast.error((e as {message: string}).message);
    } 
  }

  const handleValues = (id: Field["id"]) => {
    const fieldObject: any = {
      techstack: string,
      schedule: newTime,
    }
    return fieldObject[id]
  }

  const handleClick = (id: Field["id"]) => {
    const fieldObject: any = {
      techstack: () => {
        onOpen("techStackModal")
      },
      schedule: () => {
        onOpen("scheduleModal")
      },
    }
    return fieldObject[id]
  }

  const handleTriggerDropdown = () => {
    trigger("position")
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" id="start_time" value={time.start_time} />
      <input type="hidden" id="end_time" value={time.end_time} />
      <input type="hidden" id="position" {...register("position")} />
      <div className="flex w-full flex-col gap-4 p-4 md:flex-row md:gap-10">
        {steps.map((item, index_div) => (
          <div className="flex flex-col gap-4 md:flex md:flex-1 md:flex-col" key={`div_${index_div}`}>
            {item.fields.map((field, index_field) => (
              <SignUpInputs
                label={field.label}
                id={field.id}
                register={register}
                errors={errors}
                type={field.type}
                required={field.optional ? true : false}
                key={`field_${index_div}${index_field}`}
                placeholder={field.placeholder}
                onClick={handleClick(field.id)}
                readonly={field.id === "techstack" || field.id === "schedule"}
                getValues={field.type === "dropdown" && getValues}
                values={handleValues(field.id)}
                onChange={(e: any) => {
                  const { name, value } = e.target
                  setValue(
                    name,
                    name === "email" || name === "firstName" || name === "lastName" || name === "facebook"
                      ? value.toLowerCase()
                      : value
                  )
                  trigger(name)
                }}
                trigger={field.type === "dropdown" ? handleTriggerDropdown : undefined}
                setValue={field.id === "position" && setValue}
              />
            ))}
            {index_div === 1 && (
              <>
                <label className="flex items-center gap-4 text-sm ">
                  <Checkbox required />
                  <p>
                    I agree to the{" "}
                    <span onClick={() => onOpen("homePrivacyPolicyModal")} className="cursor-pointer text-blue-100">
                      Privacy Policy
                    </span>
                  </p>
                </label>
                <div className="mt-4 flex flex-row-reverse gap-4">
                  <Button
                    type="button"
                    className={`${buttonVariants({ variant: "link" })} order-1 w-36 py-6 `}
                    disabled={isLoading}
                  >
                    <Link href="/">Cancel</Link>
                  </Button>

                  <Button type="submit" variant="default" className="w-36 py-6" disabled={isLoading}>
                    Register
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </form>
  )
}

export default AuthForm
