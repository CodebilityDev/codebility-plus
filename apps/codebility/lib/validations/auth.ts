import * as z from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const SignUpValidation = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    username: z.string().min(8, "Username must be at least 8 characters"),
    email_address: z.string().email("Please enter a valid email"),
    phone_number: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^[\d\s\+\-\(\)]+$/, "Please enter a valid phone number"),

    years_of_experience: z.preprocess(
      (val) => (typeof val === "string" ? Number(val) : val),
      z
        .number()
        .int("Must be a whole number")
        .min(0, "Years must be 0 or greater")
        .max(50, "Years must be 50 or less"),
    ),

    portfolio_website: z.union([
      z.literal(""),
      z.string().trim().url("Must be a valid URL"),
    ]),

    // Changed from string to array to match DB
    tech_stacks: z
      .array(z.string())
      .min(1, "Please select at least one tech stack")
      .default([]),

    // Changed from single position to array to match DB
    positions: z
      .array(z.object({ id: z.number(), name: z.string() }))
      .min(1, "Please select at least one position")
      .default([]),

    facebook: z
      .string()
      .url("Must be a valid URL")
      .min(1, "Facebook link is required"),
    github: z.union([
      z.literal(""),
      z.string().trim().url("Must be a valid URL"),
    ]),
    linkedin: z.union([
      z.literal(""),
      z.string().trim().url("Must be a valid URL"),
    ]),
    discord: z.string().optional().nullable(),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Add at least one uppercase letter")
      .regex(/[0-9]/, "Add at least one number"),

    confirmPassword: z.string(),

    profileImage: z
      .any()
      .optional()
      .nullable()
      .refine(
        (file) => !file || file?.size <= 5000000,
        "Image must be 5MB or less",
      )
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Use .jpg, .jpeg, .png or .webp",
      ),

    // Added fields to match DB schema
    about: z.string().optional().nullable(),
    application_status: z
      .enum(["passed", "rejected", "applying"])
      .default("applying"),
    internal_status: z.enum(["TRAINING"]).default("TRAINING"),
    availability_status: z.boolean().default(true),
    role_id: z.number().int().default(7),
    nda_signed: z.literal(true, {
      errorMap: () => ({ message: "You must sign the NDA to proceed" }),
    }),
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
