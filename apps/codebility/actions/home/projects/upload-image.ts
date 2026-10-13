"use server";

import { createClientServerComponent } from "@/lib/global/supabase-server";
import { z } from "zod";
import {
  COVER_IMAGE_MAX_FILE_SIZE,
  COVER_IMAGE_ALLOWED_TYPES,
} from "@/constants/home/projects/projects";

const uploadImageSchema = z.object({
  file: z.instanceof(File),
});

export async function uploadProjectImage(file: File): Promise<string> {
  const parsed = uploadImageSchema.parse({ file });

  if (!COVER_IMAGE_ALLOWED_TYPES.includes(parsed.file.type as (typeof COVER_IMAGE_ALLOWED_TYPES)[number])) {
    throw new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
  }

  if (parsed.file.size > COVER_IMAGE_MAX_FILE_SIZE) {
    throw new Error("File size exceeds 5MB limit.");
  }

  const supabase = await createClientServerComponent();

  const fileExtension = parsed.file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}.${fileExtension}`;
  const filePath = `projects/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("codebility")
    .upload(filePath, parsed.file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from("codebility")
    .getPublicUrl(filePath);

  if (!publicUrlData.publicUrl) {
    throw new Error("Failed to get public URL");
  }

  return publicUrlData.publicUrl.toString();
}