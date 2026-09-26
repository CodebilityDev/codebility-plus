import * as z from "zod";

const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

export const contactUsValidation = z.object({
  name: z.string().min(1, { message: "Required" }),
  email: z.string().email().min(1, { message: "Required" }),
  telephone: z.string().refine((value) => phoneRegex.test(value), {
    message: "Invalid phone number format",
  }),
  message: z.string().min(1, { message: "Required" }),
});
