import * as z from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const isValidUrl = (url: string) => {
  if (!url) return true;
  try {
    const urlRegex =
      /^(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?$/;
    return urlRegex.test(url);
  } catch {
    return false;
  }
};

export const SignUpValidation = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email_address: z.string().email("Please enter a valid email"),
    phone_number: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[\d\s\+\-\(\)]+$/, "Please enter a valid phone number"), // More lenient phone regex

    years_of_experience: z
      .string()
      .transform((val) => (val ? Number(val) : 0))
      .pipe(
        z
          .number()
          .min(0, "Years must be 0 or greater")
          .max(50, "Years must be 50 or less"),
      ),

    portfolio_website: z.string().optional(),

    techstack: z.string().min(1, "Please select at least one tech stack"),

    position: z.string().min(1, "Please select a position"),

    facebook_link: z.string().min(1, "Facebook link is required"),
    github: z.string().optional(),
    linkedin: z.string().optional(),
    discord: z.string().optional(),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Add at least one uppercase letter")
      .regex(/[0-9]/, "Add at least one number"),

    confirmPassword: z.string(),

    profileImage: z
      .any()
      .optional()
      .refine(
        (file) => !file || file?.size <= 5000000,
        "Image must be 5MB or less",
      )
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Use .jpg, .jpeg, .png or .webp",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Sign In Validation
export const SignInValidation = z.object({
  email_address: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type SignUpInputs = z.infer<typeof SignUpValidation>;
export type SignInInputs = z.infer<typeof SignInValidation>;
