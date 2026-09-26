import { SignupFormSchema } from "@/utils/auth/sign-up/sign-up";
import { z } from "zod";

export type SignupFormData = z.infer<typeof SignupFormSchema>;

// Form field component
export interface FormFieldProps {
  label: string;
  name: keyof SignupFormData;
  type?: string;
  placeholder: string;
  register: any;
  errors: any;
  required?: boolean;
  className?: string;
}
