import type { SignInValidation } from "@/utils/auth/sign-in/auth-schema";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { z } from "zod";

export type Inputs = z.infer<typeof SignInValidation>;

export interface InputProps {
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
