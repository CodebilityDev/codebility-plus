import type { SignupFormSchema } from "@/utils/auth/sign-up/sign-up";
import type { z } from "zod";

export type SignupFormData = z.infer<typeof SignupFormSchema>;

export interface NdaSignedPayload {
  type: string;
  signed: boolean;
  signatureDataUrl?: string;
  documentDataUrl?: string;
}
