import { SignUpValidation } from "@/lib/validations/auth";

export interface FormField {
  id: keyof typeof SignUpValidation._type;
  label: string;
  placeholder: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "select"
    | "textarea";
  optional?: boolean;
  numberProps?: {
    min?: number;
    max?: number;
  };
}

export const FORM_STEPS: FormField[][] = [
  // Basic Information
  [
    {
      id: "first_name",
      label: "First Name",
      placeholder: "Enter your first name",
      type: "text",
    },
    {
      id: "last_name",
      label: "Last Name",
      placeholder: "Enter your last name",
      type: "text",
    },
    {
      id: "positions",
      label: "Positions",
      placeholder: "Select your positions",
      type: "select",
    },
    {
      id: "years_of_experience",
      label: "Years of Experience",
      placeholder: "Enter years of experience",
      type: "number",
      numberProps: {
        min: 0,
        max: 50,
      },
    },
    {
      id: "tech_stacks",
      label: "Tech Stack",
      placeholder: "Select your tech stacks",
      type: "select",
    },
    {
      id: "about",
      label: "About",
      placeholder: "Tell us about yourself",
      type: "textarea",
      optional: true,
    },
  ],

  [
    {
      id: "email_address",
      label: "Email",
      placeholder: "Enter your email",
      type: "email",
    },
    {
      id: "phone_number",
      label: "Phone Number",
      placeholder: "+63 or 0 followed by your number",
      type: "tel",
    },
    {
      id: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
    },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Confirm your password",
      type: "password",
    },
    {
      id: "portfolio_website",
      label: "Portfolio Website",
      placeholder: "Enter your portfolio URL",
      type: "text",
      optional: true,
    },
  ],
  // Social Links and Contact
  [
    {
      id: "facebook",
      label: "Facebook",
      placeholder: "Enter your Facebook profile",
      type: "text",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      placeholder: "Enter your LinkedIn profile",
      type: "text",
      optional: true,
    },
    {
      id: "github",
      label: "GitHub",
      placeholder: "Enter your GitHub profile",
      type: "text",
      optional: true,
    },

    {
      id: "discord",
      label: "Discord",
      placeholder: "username#1234",
      type: "text",
      optional: true,
    },
  ],
];
