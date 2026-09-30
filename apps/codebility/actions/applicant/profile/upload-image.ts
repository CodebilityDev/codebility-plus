"use server";

import { updateCodev } from "@/actions/applicant/profile/applicant-profile";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import type { UploadImageOptions } from "@/types/applicant/profile/profile";


const defaultOptions: Required<UploadImageOptions> = {
  bucket: "codebility",
  folder: "profileImage",
  cacheControl: "3600",
  upsert: true,
};

export async function uploadImage(
  file: File,
  options: UploadImageOptions = defaultOptions,
) {
  const supabase = await createClientServerComponent();
  try {
    const bucket = options.bucket ?? defaultOptions.bucket;
    const folder = options.folder ?? defaultOptions.folder;

    // Generate a cleaner file path
    const fileExtension = file.name.split(".").pop() ?? "";
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`; // Simpler path structure

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: options.cacheControl ?? "3600",
        upsert: options.upsert ?? true,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!publicUrlData.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    // Return only primitive values/plain objects
    /* return {
      filePath: filePath,
      publicUrl: String(publicUrlData.publicUrl),
    }; */

    if (folder == "profileImage")
      await updateCodev({ image_url: publicUrlData.publicUrl });

    return publicUrlData.publicUrl.toString();

  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}

export async function deleteImage(
  filePath: string,
  bucket = "codebility",
) {
  const supabase = await createClientServerComponent();
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error("Image deletion failed:", error);
    throw error;
  }
}

export function getImagePath(url: string): Promise<string | null> {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    // Remove the bucket name and 'object' from the path
    return Promise.resolve(pathParts.slice(6).join("/"));
  } catch {
    return Promise.resolve(null);
  }
}