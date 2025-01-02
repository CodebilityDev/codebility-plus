"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

export const uploadImage = async (
  file: File,
  folderName: string,
  bucketName: string,
): Promise<string | null> => {
  try {
    if (!file) {
      console.error("No file provided for upload");
      return null;
    }
    console.log(
      "Uploading file:",
      file.name,
      "Size:",
      file.size,
      "Type:",
      file.type,
    );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}.${extension}`;

    const supabase = await getSupabaseServerActionClient();

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(`${folderName}/${filename}`, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error(`Failed to upload ${file.name}:`, error.message);
      return null;
    }

    const { data: imageData } = supabase.storage
      .from("clients-image")
      .getPublicUrl(`public/${filename}`);

    return imageData?.publicUrl || null;
  } catch (error) {
    console.error("Error in upload image:", error);
    throw error;
  }
};

export const deleteImage = async (path: string) => {
  const supabase = await getSupabaseServerActionClient();
  const filePath = path.split("/public/")[2];

  if (filePath) {
    const { error } = await supabase.storage
      .from("clients-image")
      .remove([`public/${filePath}`]);

    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    console.error("Failed to extract file path from public URL");
  }
};

export const createClientAction = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const location = formData.get("location") as string;
  const contact_number = formData.get("contact_number") as string;
  const linkedin_link = formData.get("linkedin_link") as string;
  const start_time = formData.get("start_time") as string;
  const end_time = formData.get("end_time") as string;
  const logo = formData.get("logo") as File | null;

  const supabase = await getSupabaseServerActionClient();

  let logoPath = null;
  if (logo) {
    logoPath = await uploadImage(logo, "public", "clients-image");
  }

  const { data: clientsData, error: clientsError } = await supabase
    .from("clients")
    .insert({
      name: name,
      logo: logoPath,
      location: location || null,
      email,
      contact_number: contact_number || null,
      linkedin_link: linkedin_link,
      start_time: start_time || null,
      end_time: end_time || null,
    })
    .single();

  if (clientsError) {
    console.error("Error creating clients:", clientsError.message);
    return { success: false, error: clientsError.message };
  }

  revalidatePath("/home/clients");
  return { success: true, clientsData };
};

export const updateClientAction = async (clientId: number, formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const location = formData.get("location") as string;
  const contact_number = formData.get("contact_number") as string;
  const linkedin_link = formData.get("linkedin_link") as string;
  const start_time = formData.get("start_time") as string;
  const end_time = formData.get("end_time") as string;
  const logo = formData.get("logo") as File | null;

  const supabase = await getSupabaseServerActionClient();

  const { data: clientsData, error: clientsError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (clientsError) {
    console.error("Error fetching projects data:", clientsError.message);
    return { success: false, error: clientsError.message };
  }

  const updateClient = {
    name: name || clientsData.name,
    email: email || clientsData.email,
    location: location || clientsData.location,
    contact_number: contact_number || clientsData.contact_number,
    linkedin_link: linkedin_link || clientsData.linkedin_link,
    start_time: start_time || clientsData.start_time,
    end_time: end_time || clientsData.end_time,
    logo: clientsData.logo
  };

  if (logo) {
    if (clientsData.logo) {
      await deleteImage(clientsData.logo);
    }

    updateClient.logo = await uploadImage(
      logo,
      "public",
      "clients-image",
    );
  }

  const { data: updateClientsData, error: updateClientsError } = await supabase
    .from("clients")
    .update(updateClient)
    .eq("id", clientId)
    .single();

  if (updateClientsError) {
    console.error("Error updating client:", updateClientsError.message);
    return { success: false, error: updateClientsError.message };
  }

  revalidatePath("/home/clients");
  return { success: true, data: updateClientsData };
};

export const toggleClientArchiveAction = async (clientId: number) => {
  const supabase = await getSupabaseServerActionClient();

  const { data: client, error: fetchError } = await supabase
    .from("clients")
    .select("is_archive")
    .eq("id", clientId)
    .single();

  if (fetchError) {
    console.error("Error fetching client data:", fetchError.message);
    return { success: false, error: fetchError.message };
  }

  const newIsArchiveValue = !client.is_archive;

  const { data: updatedClient, error: updateError } = await supabase
    .from("clients")
    .update({
      is_archive: newIsArchiveValue,
    })
    .eq("id", clientId)
    .single();

  if (updateError) {
    console.error("Error updating client:", updateError.message);
    return { success: false, error: updateError.message };
  }

  revalidatePath("/home/clients");
  return { success: true, updatedClient };
};

export const deleteClientAction = async (id: number) => {
  const supabase = await getSupabaseServerActionClient();

  const { data: clientData, error: getClientError } = await supabase
    .from("clients")
    .select("logo")
    .eq("id", id)
    .single();

  if (getClientError) {
    console.error("Error fetching client data:", getClientError.message);
    return { success: false, error: getClientError.message };
  }

  if (clientData.logo) {
    await deleteImage(clientData.logo);
  }

  const { error: deleteClientError } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (deleteClientError) {
    console.error("Error deleting client:", deleteClientError.message);
    return { success: false, error: deleteClientError.message };
  }

  revalidatePath("/home/clients/archive");
  return { success: true };
};
