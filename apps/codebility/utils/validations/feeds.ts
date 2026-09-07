import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title is too long"),

  content: z
    .string()
    .max(15000, "Post content is too long"),

  author_id: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  content_image_ids: z.any().optional(),
  tag_ids: z.any().optional(),
});


export const editPostSchema = createPostSchema.extend({
  id: z.string(),
});