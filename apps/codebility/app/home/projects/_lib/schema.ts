import * as z from "zod";

const isFile = (value: any): value is File =>
  typeof File !== "undefined" && value instanceof File;

const fileSchema = z.custom<File>((val) => isFile(val), {
  message: "Must be a File object",
});

export const projectSchema = z.object({
  // Required fields
  project_name: z.string().min(1, { message: "Project name is required" }),
  team_leader_id: z.string().min(1, { message: "Team Leader is required" }),
  clientId: z.string().min(1, { message: "Client is required" }),
  // selectedMembers: z
  //   .array(
  //     z.object({
  //       id: z.string(),
  //       first_name: z.string(),
  //       last_name: z.string(),
  //       image_url: z.string().optional(),
  //       position: z.string(),
  //     }),
  //   )
  //   .nonempty("At least one member must be selected"),

  // Optional fields
  thumbnail: z.union([fileSchema, z.string()]).optional(),
  summary: z.string().optional(),
  live_link: z.union([z.string().url(), z.literal("")]),
  figma_link: z.union([z.string().url(), z.literal("")]),
  github_link: z.union([z.string().url(), z.literal("")]),
  status: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
