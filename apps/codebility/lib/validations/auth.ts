import * as z from "zod";

const isValidGitHubUrl = (url: string) => {
  try {
    if (url === "") return true;
    const githubUrlRegex =
      /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    return githubUrlRegex.test(url);
  } catch (e) {
    return false;
  }
};
const isValidUrl = (url: string) => {
  if (!url) return true;
  const urlRegex =
    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?$/;
  return urlRegex.test(url);
};

export const SignUpValidation = z
  .object({
    firstName: z.string().min(1, { message: "Required" }),
    lastName: z.string().min(1, { message: "Required" }),
    email_address: z.string().email().min(1, { message: "Required" }),
    facebook: z
      .string()
      .min(1, { message: "Required" })
      .refine((value: string | undefined) => isValidUrl(value as string), {
        message: "Invalid Url Format",
      }),
    website: z
      .string()
      .optional()
      .refine((value: string | undefined) => isValidUrl(value || ""), {
        message: "Invalid Url Format",
      }),
    github: z
      .string()
      .optional()
      .refine((value: string | undefined) => isValidGitHubUrl(value || ""), {
        message: "Invalid Url Format",
      }),
    techstack: z.string().min(1, { message: "Required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .refine((value: string) => /[a-z]/.test(value), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((value: string) => /[A-Z]/.test(value), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((value: string) => /\d/.test(value), {
        message: "Password must contain at least one digit",
      })
      .refine(
        (value: string) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value),
        {
          message: "Password must contain at least one special character",
        },
      ),
    confirmPassword: z.string().min(1, { message: "Required" }),
    schedule: z.string().min(1, { message: "Required" }),
    position: z.string().min(1, { message: "Required" }),
    profileImage: z.instanceof(File, { message: "Profile image is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export const SignInValidation = z.object({
  email_address: z.string().email().min(1, { message: "Email Required" }),
  password: z.string().min(1, { message: "Password Required" }),
});

export const EmailValidation = z.object({
  email: z.string().email().min(1, { message: "Email Required" }),
});

export const PasswordValidation = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine((value: string) => /[a-z]/.test(value), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((value: string) => /[A-Z]/.test(value), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((value: string) => /\d/.test(value), {
      message: "Password must contain at least one digit",
    })
    .refine((value: string) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value), {
      message: "Password must contain at least one special character",
    }),
});
