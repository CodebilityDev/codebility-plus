import { EmailValidation } from "@/utils/auth/password-reset/password-reset";
import { z } from "zod";

export type Inputs = z.infer<typeof EmailValidation>;
