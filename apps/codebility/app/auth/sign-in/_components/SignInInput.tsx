"use client";

import { useState } from "react";
import { SignInValidation } from "@/lib/validations/auth";
import { IconEye, IconEyeClose } from "@/public/assets/svgs";
import clsx from "clsx";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { z } from "zod";

type Inputs = z.infer<typeof SignInValidation>;

interface InputProps {
  label: string;
  id: "email_address" | "password";
  type?: string;
  required?: boolean;
  register: UseFormRegister<Inputs>;
  errors: FieldErrors;
  disabled?: boolean;
  placeholder?: string;
  values?: string;
  onClick?: () => void;
  onChange?: () => void;
  readonly?: boolean;
}

const SignInInputs = ({
  label,
  id,
  type,
  register,
  errors,
  disabled,
  placeholder,
  onClick,
  readonly,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col" onClick={onClick}>
      <label
        htmlFor={id}
        className={clsx("text-white", errors[id] && "text-red-400")}
      >
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
              if (id === "email_address") {
                e.target.value = e.target.value.toLowerCase();
              }
            },
          })}
          className={clsx(
            "bg-dark-200 placeholder:text-gray mt-[5px] rounded-lg border border-zinc-700 p-2 text-lg focus:outline-none",
            errors[id] ? "border-red-400" : "border-darkgray",
            disabled && "cursor-default opacity-50",
            readonly && "cursor-default",
          )}
          placeholder={placeholder}
        />
        {type === "password" && (
          <div className="absolute right-4 top-[50%] z-20 w-6 -translate-y-[50%] cursor-pointer sm:right-2 sm:w-8">
            {showPassword ? (
              <EyeOffIcon
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xl text-purple-500"
              />
            ) : (
              <EyeIcon
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xl text-purple-500"
              />
            )}
          </div>
        )}
      </div>

      {errors[id]?.message && (
        <p className="text-md mt-2 text-red-400">
          {(errors[id]?.message as string) || "An error occurred"}
        </p>
      )}
    </div>
  );
};

export default SignInInputs;
