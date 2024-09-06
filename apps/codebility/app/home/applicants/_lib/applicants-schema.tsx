import * as z from "zod";

export const applicantsSchema = z.object({
    id: z.number().optional(),
    first_name: z.string().min(1, { message: "First Name is required" }),
    last_name: z.string().min(1, { message: "Last Name is required" }),
    email_address: z.string().min(1, { message: "Email is required" }).email(),
    portfolio_website: z.string().min(1, { message: "Website is required" }).url(),
    github_link: z.string().min(1, { message: "Github Link is required" }).url(),
    tech_stacks: z.string().min(1, { message: "Tech Stack is required" }),
});

export type ApplicantsFormValues = z.infer<typeof applicantsSchema>;
