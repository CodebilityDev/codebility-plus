"use server";

import { createServer } from "@/utils/supabase";

export const getAllServices = async () => {
  const supabase = createServer();
  const { data, error } = await supabase.from("services").select("*");

  if (error) {
    console.error("Error fetching services:", error.message);
    return null;
  }

  return data;
};

export const getServiceById = async (serviceId: string) => {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", serviceId)
    .single();

  if (error) {
    console.log("Error getting service: ", error.message);
    return { success: false, error: error.message };
  }

  const getFileDetails = async (filePath: string) => {
    const fileName = filePath.split("/").pop();

    const { data: fileMetadata, error: fileError } = await supabase.storage
      .from("services-image")
      .list("public");

    if (fileError || !fileMetadata || fileMetadata.length === 0) {
      console.log("Error fetching file details: ", fileError?.message);
      return null;
    }

    const file = fileMetadata.find((file) => file.name === fileName);
    if (!file) {
      console.log(`File not found: ${fileName}`);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from("services-image")
      .getPublicUrl(filePath);

    return {
      fileName: file.name,
      metadata: file.metadata || {},
      createdAt: file.created_at,
      url: publicUrl.publicUrl,
    };
  };

  const images = [];
  if (data?.mainImage) {
    const mainImageDetails = await getFileDetails(data.mainImage);
    if (mainImageDetails) images.push({ mainImage: mainImageDetails });
  }
  if (data?.picture1) {
    const picture1Details = await getFileDetails(data.picture1);
    if (picture1Details) images.push({ picture1: picture1Details });
  }
  if (data?.picture2) {
    const picture2Details = await getFileDetails(data.picture2);
    if (picture2Details) images.push({ picture2: picture2Details });
  }

  return { success: true, data: { ...data, images } };
};
