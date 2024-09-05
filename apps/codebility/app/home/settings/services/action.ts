"use server";

import { revalidatePath } from "next/cache";
import { createServer } from "@/utils/supabase";

export const uploadImage = async (
  file: File | null,
  folderName: string,
  bucketName: string,
) => {
  if (!file) {
    console.error("No file provided for upload");
    return null;
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const extension = file.name.split(".").pop();
  const filename = `${timestamp}.${extension}`;

  const supabase = await createServer();

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(`${folderName}/${filename}`, buffer, {
      contentType: file.type,
    });

  if (error) {
    console.error(`Failed to upload ${file.name}:`, error.message);
    return null;
  }
  return data.path;
};

export const deleteImage = async (path: string) => {
  try {
    const filePath = path.replace("public/", "");
    if (!filePath) {
      throw new Error("File path could not be extracted from URL");
    }

    const supabase = await createServer();
    const { error } = await supabase.storage
      .from("services-image")
      .remove([`public/${filePath}`]);

    if (error) {
      console.error("Error deleting image:", error.message);
      return { success: false, error: error.message };
    }

    console.log("Image deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, error: error };
  }
};

export const createServiceAction = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const mainImage = formData.get("mainImage") as File | null;
  const picture1 = formData.get("picture1") as File | null;
  const picture2 = formData.get("picture2") as File | null;
  const userId = formData.get("userId") as string;

  const supabase = await createServer();

  const mainImagePath = await uploadImage(
    mainImage,
    "public",
    "services-image",
  );
  const picture1Path = await uploadImage(picture1, "public", "services-image");
  const picture2Path = await uploadImage(picture2, "public", "services-image");

  if (!mainImagePath || !picture1Path || !picture2Path) {
    console.error("One or more file uploads failed");
    return { success: false, error: "File upload failed" };
  }

  const { data: servicesData, error: servicesError } = await supabase
    .from("services")
    .insert({
      name,
      description,
      category,
      mainImage: mainImagePath,
      picture1: picture1Path,
      picture2: picture2Path,
      userId,
    })
    .single();

  if (servicesError) {
    console.error("Error creating services:", servicesError.message);
    return { success: false, error: servicesError.message };
  }

  revalidatePath("/home/settings/services");
  return { success: true, servicesData };
};

export const updateServiceAction = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  let mainImage = formData.get("mainImage") as string;
  let picture1 = formData.get("picture1") as string;
  let picture2 = formData.get("picture2") as string;
  const userId = formData.get("userId") as string;

  const mainImageFile = formData.get("mainImage") as File | null;
  const picture1File = formData.get("picture1") as File | null;
  const picture2File = formData.get("picture2") as File | null;

  const supabase = await createServer();

  if (mainImageFile instanceof File) {
    if (mainImage) await deleteImage(mainImage);
    const uploadedMainImage = await uploadImage(
      mainImageFile,
      "public",
      "services-image",
    );
    mainImage = uploadedMainImage ?? "";
  }

  if (picture1File instanceof File) {
    if (picture1) await deleteImage(picture1);
    const uploadedPicture1 = await uploadImage(
      picture1File,
      "public",
      "services-image",
    );
    picture1 = uploadedPicture1 ?? "";
  }

  if (picture2File instanceof File) {
    if (picture2) await deleteImage(picture2);
    const uploadedPicture2 = await uploadImage(
      picture2File,
      "public",
      "services-image",
    );
    picture2 = uploadedPicture2 ?? "";
  }

  const updateData: any = {
    name,
    description,
    category,
    userId,
  };

  if (mainImage) updateData.mainImage = mainImage;
  if (picture1) updateData.picture1 = picture1;
  if (picture2) updateData.picture2 = picture2;

  const { error } = await supabase
    .from("services")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating service:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
};

export const deleteServiceAction = async (formData: FormData) => {
  const id = formData.get("id") as string;

  const supabase = await createServer();

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("mainImage, picture1, picture2")
    .eq("id", id)
    .single();

  if (serviceError || !service) {
    console.error("Error fetching service:", serviceError?.message);
    return {
      success: false,
      error: serviceError?.message || "Service not found",
    };
  }

  await deleteImage(service.mainImage);
  await deleteImage(service.picture1);
  await deleteImage(service.picture2);

  const { error: deleteError } = await supabase
    .from("services")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Error deleting service:", deleteError.message);
    return { success: false, error: deleteError.message };
  }

  revalidatePath("/home/settings/services");
  return { success: true };
};
