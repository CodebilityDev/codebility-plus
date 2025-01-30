import { getSupabaseBrowserClient } from "@codevs/supabase/browser-client";

interface UploadImageOptions {
  bucket?: string;
  folder?: string;
  cacheControl?: string;
  upsert?: boolean;
}

const defaultOptions: UploadImageOptions = {
  bucket: "codebility",
  folder: "profileImage",
  cacheControl: "3600",
  upsert: true,
};

export async function uploadImage(
  file: File,
  options: UploadImageOptions = defaultOptions,
) {
  const supabase = getSupabaseBrowserClient();
  try {
    const { bucket = "codebility", folder = "profileImage" } = options;

    // Generate a cleaner file path
    const fileExtension = file.name.split(".").pop() || "";
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`; // Simpler path structure

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: options.cacheControl || "3600",
        upsert: options.upsert ?? true,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    return {
      filePath,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}

export async function deleteImage(
  filePath: string,
  bucket: string = "codebility",
) {
  const supabase = getSupabaseBrowserClient();
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

export function getImagePath(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    // Remove the bucket name and 'object' from the path
    return pathParts.slice(2).join("/");
  } catch {
    return null;
  }
}
