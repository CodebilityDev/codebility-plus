"use server";

import { revalidatePath } from "next/cache";
import { deleteImage, uploadImage } from "@/utils/uploadImage";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

/**
 * CREATE CLIENT ACTION
 *
 * Adjust the form fields to match what your `clients` table actually needs.
 */
export const createClientAction = async (formData: FormData) => {
  // Fields that exist in your schema:
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone_number = formData.get("phone_number") as string;
  const address = formData.get("address") as string;
  const status = formData.get("status") as string; // e.g. 'prospect' | 'active' | 'inactive'
  const website = formData.get("website") as string | null;
  const client_type = formData.get("client_type") as string;
  const country = formData.get("country") as string;
  const logoFile = formData.get("logo") as File | null; // This will be uploaded

  const supabase = await getSupabaseServerActionClient();

  let company_logo: string | null = null;
  if (logoFile) {
    // Upload the file and retrieve the publicUrl string
    const { publicUrl } = await uploadImage(logoFile, {
      bucket: "codebility",
      folder: "clientImage",
    });
    company_logo = publicUrl;
  }
  test;
  const { data: newClient, error: createError } = await supabase
    .from("clients")
    .insert({
      name,
      email: email || null,
      phone_number: phone_number || null,
      address: address || null,
      company_logo,
      status: status || "prospect",
      website: website || null,
      client_type,
      country,
    })
    .single();

  if (createError) {
    console.error("Error creating client:", createError.message);
    return { success: false, error: createError.message };
  }

  // Revalidate the path so changes show up on reload
  revalidatePath("/home/clients");
  return { success: true, data: newClient };
};

/**
 * UPDATE CLIENT ACTION
 *
 * Updates any of the fields above if new values are provided.
 * Retains existing data if none is given.
 */
export const updateClientAction = async (
  clientId: string, // UUID from your table
  formData: FormData,
) => {
  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const phone_number = formData.get("phone_number") as string | null;
  const address = formData.get("address") as string | null;
  const status = formData.get("status") as string | null;
  const website = formData.get("website") as string | null;
  const client_type = formData.get("client_type") as string | null;
  const country = formData.get("country") as string | null;
  const logoFile = formData.get("logo") as File | null;

  const supabase = await getSupabaseServerActionClient();

  // Fetch existing client row
  const { data: clientData, error: fetchError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (fetchError || !clientData) {
    console.error("Error fetching client:", fetchError?.message);
    return { success: false, error: fetchError?.message || "Client not found" };
  }

  // Current value of company_logo in the DB (a string)
  let company_logo = clientData.company_logo;

  // If a new file is uploaded, remove the old image (if any) and upload the new one
  if (logoFile) {
    // Delete the old image if it exists
    if (company_logo) {
      await deleteImage(company_logo);
    }
    // Upload the new file -> publicUrl
    const { publicUrl } = await uploadImage(logoFile, {
      bucket: "codebility",
      folder: "clientImage",
    });
    company_logo = publicUrl;
  }

  const updatedFields = {
    name: name || clientData.name,
    email: email || clientData.email,
    phone_number: phone_number || clientData.phone_number,
    address: address || clientData.address,
    status: status || clientData.status,
    company_logo,
    website: website || clientData.website,
    client_type: client_type || clientData.client_type,
    country: country || clientData.country,
  };

  // Update row
  const { data: updatedClient, error: updateError } = await supabase
    .from("clients")
    .update(updatedFields)
    .eq("id", clientId)
    .single();

  if (updateError) {
    console.error("Error updating client:", updateError.message);
    return { success: false, error: updateError.message };
  }

  revalidatePath("/home/clients");
  return { success: true, data: updatedClient };
};

/**
 * TOGGLE CLIENT STATUS ACTION
 *
 * If a client is 'inactive', set them 'active'; otherwise, set them 'inactive'.
 */
export const toggleClientStatusAction = async (clientId: string) => {
  const supabase = await getSupabaseServerActionClient();

  const { data: client, error: fetchError } = await supabase
    .from("clients")
    .select("status")
    .eq("id", clientId)
    .single();

  if (fetchError || !client) {
    console.error("Error fetching client:", fetchError?.message);
    return { success: false, error: fetchError?.message };
  }

  // Toggle logic
  const newStatus = client.status === "inactive" ? "active" : "inactive";

  const { data: updatedClient, error: updateError } = await supabase
    .from("clients")
    .update({ status: newStatus })
    .eq("id", clientId)
    .single();

  if (updateError) {
    console.error("Error toggling client status:", updateError.message);
    return { success: false, error: updateError.message };
  }

  revalidatePath("/home/clients");
  return { success: true, data: updatedClient };
};

/**
 * DELETE CLIENT ACTION
 *
 * Removes a client row by ID. Also deletes its associated image from storage if present.
 */
export const deleteClientAction = async (id: string) => {
  const supabase = await getSupabaseServerActionClient();

  // 1. Fetch the client’s existing company_logo, if any
  const { data: clientData, error: getClientError } = await supabase
    .from("clients")
    .select("company_logo")
    .eq("id", id)
    .single();

  if (getClientError) {
    console.error("Error fetching client data:", getClientError.message);
    return { success: false, error: getClientError.message };
  }

  // 2. Delete the image if it exists
  if (clientData?.company_logo) {
    await deleteImage(clientData.company_logo);
  }

  // 3. Delete the client record
  const { error: deleteClientError } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (deleteClientError) {
    console.error("Error deleting client:", deleteClientError.message);
    return { success: false, error: deleteClientError.message };
  }

  // Revalidate the clients list
  revalidatePath("/home/clients");
  return { success: true };
};

// Fetch country list
interface Country {
  cca2: string;
  name: { common: string };
}
export const fetchCountry = async () => {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all", {
      cache: "force-cache",
    });
    const countryData = (await res.json()) as Country[];

    return countryData
      .map((country: { cca2: string; name: { common: string } }) => ({
        value: country.cca2.toLowerCase(),
        label: country.name.common,
      }))
      .sort((a: { label: string }, b: { label: string }) =>
        a.label.localeCompare(b.label),
      );
  } catch (err) {
    console.log("Error fetching countries. ", err);
  }
};
