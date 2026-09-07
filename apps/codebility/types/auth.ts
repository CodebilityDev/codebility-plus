import type { z } from "zod";

import type { SignInValidation, SignUpValidation } from "@/utils/validations/auth";

export type SignUpInputs = z.infer<typeof SignUpValidation>;
export type SignInInputs = z.infer<typeof SignInValidation>;
