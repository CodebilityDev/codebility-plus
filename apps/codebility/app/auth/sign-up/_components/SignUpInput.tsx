"use client";

import { useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { useTechStackStore } from "@/hooks/use-techstack";
import { IconEye, IconEyeClose } from "@/public/assets/svgs";
import { ChevronDown } from "lucide-react";

import { cn } from "@codevs/ui";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";

import { PositionMultiselectField } from "./PositionMultiselectField";
import PositionSelect from "./PositionSelect";
import { TechStackMultiselectField } from "./TechstackMultiselectForm";

interface SignUpInputsProps {
  label: string;
  id: string;
  register: any;
  errors: any;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  modalType?: string;
  onChange?: (e: any) => void;
  values?: string;
  setValue?: any;
  getValues?: any;
  trigger?: () => void;
}

const SignUpInputs = ({
  label,
  id,
  type = "text",
  register,
  errors,
  disabled,
  placeholder,
  readonly,
  required = true,
  modalType,
  onChange,
  values,
  setValue,
  getValues,
  trigger,
}: SignUpInputsProps) => {
  const [showPassword, setShowPassword] = useState(false);

  // Common components
  const InputLabel = () => (
    <label
      htmlFor={id}
      className={cn("text-white", errors[id] && "text-red-400")}
    >
      {label}
      {!required && <span className="text-gray ml-1">(Optional)</span>}
    </label>
  );

  const ErrorMessage = () =>
    errors[id]?.message && (
      <p className="text-sm text-red-400">{errors[id]?.message}</p>
    );

  const inputStyles = cn(
    "md:text-md bg-dark-200 placeholder:text-gray border-b-2 p-2 text-sm focus:outline-none lg:text-lg",
    errors[id] ? "border-red-400" : "border-darkgray",
    disabled && "cursor-default opacity-50",
    readonly && "cursor-default",
  );

  // Handle modal inputs (techstack and availability)
  if (id === "tech_stacks") {
    return (
      <div className="flex flex-col gap-1">
        <InputLabel />
        <TechStackMultiselectField id={id} error={errors[id]?.message} />
        <ErrorMessage />
      </div>
    );

    // return (
    //   <div
    //     className="flex flex-col gap-1"
    //     onClick={() => {
    //       onOpen("techStackModal");
    //       console.log("tech stack clicked");
    //     }}
    //   >
    //     <InputLabel />
    //     <Input
    //       {...register(id)}
    //       value={stack.join(", ")}
    //       className={cn(inputStyles, "cursor-pointer")}
    //       readOnly
    //       placeholder={placeholder}
    //       onChange={(e) => {
    //         // This won't actually fire because it's readonly
    //         setValue(id, e.target.value, {
    //           shouldValidate: true,
    //         });
    //       }}
    //     />
    //     <ErrorMessage />
    //   </div>
    // );
  }

  // Handle position select
  if (id === "positions") {
    return (
      <div className="flex flex-col gap-1">
        <InputLabel />
        <PositionMultiselectField id={id} error={errors[id]?.message} />
        <ErrorMessage />
      </div>
    );
    // return (
    //   <div className="flex flex-col gap-1">
    //     <InputLabel />
    //     <PositionSelect
    //       value={values}
    //       onChange={(value) => {
    //         setValue(id, value, {
    //           shouldValidate: false,
    //         });
    //       }}
    //       error={errors[id]?.message}
    //     />
    //     <ErrorMessage />
    //   </div>
    // );
  }

  if (type === "number") {
    return (
      <div className="flex flex-col gap-1">
        <InputLabel />
        <Input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          max={50}
          placeholder={placeholder}
          disabled={disabled}
          className={inputStyles}
          {...register(id)}
          onChange={(e) => {
            setValue(id, e.target.value);
            if (onChange) onChange(e);
          }}
        />
        <ErrorMessage />
      </div>
    );
  }

  // Default input (text, email, password)
  return (
    <div className="flex flex-col gap-1">
      <InputLabel />
      <div className="relative">
        <Input
          id={id}
          type={!showPassword ? type : "text"}
          placeholder={placeholder}
          disabled={disabled}
          className={inputStyles}
          {...register(id)}
          onChange={onChange}
          value={values}
          readOnly={readonly}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[65%] -translate-y-1/2 cursor-pointer sm:right-1"
          >
            {showPassword ? (
              <IconEyeClose className="text-customBlue-100" />
            ) : (
              <IconEye />
            )}
          </button>
        )}
      </div>
      <ErrorMessage />
    </div>
  );
};

export default SignUpInputs;
