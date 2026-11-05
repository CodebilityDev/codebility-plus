import type { SignupFormSchema } from "@/utils/auth/sign-up/sign-up";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { z } from "zod";

export type SignupFormData = z.infer<typeof SignupFormSchema>;

export interface NdaSignedPayload {
  type: string;
  signed: boolean;
  signatureDataUrl?: string;
  documentDataUrl?: string;
}

export interface PasswordFieldProps {
  label: string;
  name: keyof SignupFormData;
  placeholder: string;
  register: UseFormRegister<SignupFormData>;
  errors: FieldErrors<SignupFormData>;
  showPassword: boolean;
  toggleShow: () => void;
}

// Form field component
export interface FormFieldProps {
  label: string;
  name: keyof SignupFormData;
  type?: string;
  placeholder: string;
  register: UseFormRegister<SignupFormData>;
  errors: FieldErrors<SignupFormData>;
  required?: boolean;
  className?: string;
}
