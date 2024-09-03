"use client"

import { Input } from "@codevs/ui/input"
import { IconEye, IconEyeClose } from "@/public/assets/svgs"
import clsx from "clsx"
import { cn } from "@codevs/ui"
import { SignUpValidation } from "@/lib/validations/auth"
import { useRef, useState } from "react"
import { FieldErrors, UseFormRegister } from "react-hook-form"
import { z } from "zod"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select"
import { positions } from "@/constants"

type Inputs = z.infer<typeof SignUpValidation>

export interface InputProps {
  label: string
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
  type?: string
  required?: boolean
  register: UseFormRegister<Inputs>
  errors: FieldErrors
  disabled?: boolean
  placeholder?: string
  values?: string
  // eslint-disable-next-line no-unused-vars
  onClick?: (e?: any) => void
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: any) => void
  readonly?: boolean
  setValue?: any
  getValues?: any
  emailAlreadyExist?: boolean
  trigger?: () => void
}

const SignUpInputs = ({
  label,
  id,
  type,
  register,
  errors,
  disabled,
  placeholder,
  onClick,
  values,
  onChange,
  readonly,
  setValue,
  emailAlreadyExist,
  getValues,
  trigger,
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [emailExist] = useState(false)
  return (
    <div className="flex flex-col gap-1" onClick={onClick}>
      <label htmlFor={id} className={clsx("text-white", errors[id] && "text-red-400")}>
        {label}
      </label>

      {(type === "text" || type === "password" || type === "email") && (
        <div className="relative flex flex-col">
          {readonly ? (
            <Input
              id={id}
              type={!showPassword ? type : "text"}
              autoComplete={id}
              disabled={disabled}
              {...register(id)}
              className={cn(
                "md:text-md border-b-2 bg-dark-200 p-2 text-sm placeholder:text-gray focus:outline-none lg:text-lg",
                errors[id] ? "border-red-400" : "border-darkgray",
                disabled && "cursor-default opacity-50",
                readonly && "cursor-default"
              )}
              placeholder={placeholder}
              ref={inputRef}
              readOnly={readonly}
              value={values}
            />
          ) : (
            <Input
              id={id}
              type={!showPassword ? type : "text"}
              autoComplete={id}
              disabled={disabled}
              {...register(id)}
              className={cn(
                "md:text-md border-b-2 bg-dark-200 p-2 text-sm placeholder:text-gray focus:outline-none lg:text-lg",
                errors[id] || emailExist ? "border-red-400" : "border-darkgray",
                disabled && "cursor-default opacity-50",
                readonly && "cursor-default"
              )}
              placeholder={placeholder}
              readOnly={readonly}
              autoFocus={emailAlreadyExist}
              onChange={onChange}
            />
          )}
          {type === "password" && (
            <div className="absolute right-4 top-[65%] w-6 -translate-y-[50%] cursor-pointer sm:right-1">
              {showPassword ? (
                <IconEyeClose onClick={() => setShowPassword((prev) => !prev)} className="text-blue-100" />
              ) : (
                <IconEye onClick={() => setShowPassword((prev) => !prev)} className="" />
              )}
            </div>
          )}
        </div>
      )}
      {type === "dropdown" && (
        <DropdownInput
          register={register}
          errors={errors}
          setValue={setValue}
          disabled={disabled}
          getValues={getValues}
          trigger={trigger}
        />
      )}
      {errors[id]?.message && (
        <p className="mt-2 text-sm text-red-400">{(errors[id]?.message as string) || "An error occurred"}</p>
      )}
    </div>
  )
}

interface DropdownInputProps {
  errors?: any
  register: UseFormRegister<Inputs>
  setValue?: any
  getValues?: any
  disabled?: boolean
  trigger?: InputProps["trigger"]
}

const DropdownInput = ({ errors, trigger, register, setValue, getValues, disabled }: DropdownInputProps) => {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(getValues("position") || null)
  return (
    <>
      <div
        className={cn(`mt-4 flex flex-col justify-between`, errors.position && "border-red-400 dark:border-red-400")}
      >
        <Select
          onValueChange={(value) => {
            setValue("position", value)
            setSelectedPosition(value)
            if (trigger) trigger()
          }}
          value={selectedPosition || ""}
          disabled={disabled}
        >
          <SelectTrigger
            aria-label="Position"
            className="md:text-md border-b-2 bg-dark-200 p-2 text-sm placeholder:text-gray focus:outline-none lg:text-lg"
          >
            <SelectValue
              className=""
              placeholder="Select Desired Position"
              {...register("position", { required: true })}
            />
          </SelectTrigger>

          <SelectContent className="">
            <SelectGroup>
              <SelectLabel className="text-xs text-gray">Please select desired position</SelectLabel>
              {positions.map((position, i) => (
                <SelectItem key={i} className="text-xs" value={position}>
                  {position}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}

export default SignUpInputs
