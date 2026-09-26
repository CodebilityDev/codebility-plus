import type { EmailValidation } from "@/utils/auth/password-reset/password-reset";
import type { z } from "zod";

export type Inputs = z.infer<typeof EmailValidation>;
