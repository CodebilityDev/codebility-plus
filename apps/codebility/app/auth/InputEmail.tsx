"use client"

import { z } from "zod"
import clsx from "clsx"
import { useState } from "react"

import { EmailValidation } from "@/lib/validations/auth"
import { FieldErrors, UseFormRegister } from "react-hook-form"

type Inputs = z.infer<typeof EmailValidation>

interface InputProps {
  label: string
  id: "email"
  type?: string
  required?: boolean
  register: UseFormRegister<Inputs>
  errors: FieldErrors
  disabled?: boolean
  placeholder?: string
  values?: string
  onClick?: () => void
  onChange?: () => void
  readonly?: boolean
}

const InputEmail = ({ label, id, type, register, errors, disabled, placeholder, onClick, readonly }: InputProps) => {
  const [showPassword] = useState(false)

  return (
    <div className="flex flex-col gap-2" onClick={onClick}>
      <label htmlFor={id} className={clsx("text-gray", errors[id] && "text-red-400")}>
        {label}
      </label>

      <div className="relative flex flex-col">
        <input
          id={id}
          type={!showPassword ? type : "text"}
          disabled={disabled}
          autoComplete={id}
          {...register(id, {
            onChange: (e) => {
              e.target.value = e.target.value.toLowerCase();
            }
          })}
          className={clsx(
            "text-md border-b-2 bg-dark-200 p-2 placeholder:font-thin placeholder:text-zinc-600 focus:outline-none",
            errors[id] ? "border-red-400" : "border-darkgray",
            disabled && "cursor-default opacity-50",
            readonly && "cursor-default",
            type === "password" && "pr-16"
          )}
          placeholder={placeholder}
        />
      </div>

      {errors[id]?.message && (
        <p className="mt-2 text-sm text-red-400">{(errors[id]?.message as string) || "An error occurred"}</p>
      )}
    </div>
  )
}

export default InputEmail
