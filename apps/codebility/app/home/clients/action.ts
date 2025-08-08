"use server";

import { revalidatePath } from "next/cache";
import { deleteImage, uploadImage } from "@/utils/uploadImage";
import { createClientServerComponent } from "@/utils/supabase/server";

// Simple type definitions
interface ActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * CREATE CLIENT ACTION - Simplified with better error handling
 */
export const createClientAction = async (formData: FormData): Promise<ActionResult> => {
  try {
    const supabase = await createClientServerComponent();
    
    // Extract form data with defaults
    const clientData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string || null,
      phone_number: formData.get("phone_number") as string || null,
      address: formData.get("address") as string || null,
      website: formData.get("website") as string || null,
      client_type: formData.get("client_type") as string || null,
      country: formData.get("country") as string || null,
      status: (formData.get("status") as string) || "prospect",
    };

    // Handle logo upload
    let company_logo: string | null = null;
    const logoFile = formData.get("logo") as File | null;
    
    if (logoFile && logoFile.size > 0) {
      company_logo = await uploadImage(logoFile, {
        bucket: "codebility",
        folder: "clientImage",
      });
    }

    const { data, error } = await supabase
      .from("clients")
      .insert({ ...clientData, company_logo })
      .select()
      .single();

    if (error) {
      console.error("Error creating client:", error.message);
      return { success: false, error: error.message };
    }

    revalidatePath("/home/clients");
    return { success: true, data };
    
  } catch (error) {
    console.error("Unexpected error in createClientAction:", error);
    return { success: false, error: "Failed to create client" };
  }
};

/**
 * UPDATE CLIENT ACTION - Simplified logic
 */
export const updateClientAction = async (
  clientId: string,
  formData: FormData
): Promise<ActionResult> => {
  try {
    const supabase = await createClientServerComponent();

    // Get existing client data
    const { data: existingClient, error: fetchError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (fetchError || !existingClient) {
      return { success: false, error: "Client not found" };
    }

    // Build update object with only provided fields
    const updates: Record<string, any> = {};
    
    const fields = ['name', 'email', 'phone_number', 'address', 'website', 'client_type', 'country', 'status'];
    
    fields.forEach(field => {
      const value = formData.get(field) as string;
      if (value !== null) {
        updates[field] = value || existingClient[field]; // Keep existing if empty string
      }
    });

    // Handle logo update
    let company_logo = existingClient.company_logo;
    const logoFile = formData.get("logo") as File | null;
    
    if (logoFile && logoFile.size > 0) {
      // Delete old logo if exists
      if (company_logo) {
        await deleteImage(company_logo);
      }
      // Upload new logo
      company_logo = await uploadImage(logoFile, {
        bucket: "codebility",
        folder: "clientImage",
      });
      updates.company_logo = company_logo;
    }

    const { data, error } = await supabase
      .from("clients")
      .update(updates)
      .eq("id", clientId)
      .select()
      .single();

    if (error) {
      console.error("Error updating client:", error.message);
      return { success: false, error: error.message };
    }

    revalidatePath("/home/clients");
    return { success: true, data };
    
  } catch (error) {
    console.error("Unexpected error in updateClientAction:", error);
    return { success: false, error: "Failed to update client" };
  }
};

/**
 * TOGGLE CLIENT STATUS ACTION - Simplified
 */
export const toggleClientStatusAction = async (clientId: string): Promise<ActionResult> => {
  try {
    const supabase = await createClientServerComponent();

    const { data: client, error: fetchError } = await supabase
      .from("clients")
      .select("status")
      .eq("id", clientId)
      .single();

    if (fetchError || !client) {
      return { success: false, error: "Client not found" };
    }

    const newStatus = client.status === "inactive" ? "active" : "inactive";

    const { data, error } = await supabase
      .from("clients")
      .update({ status: newStatus })
      .eq("id", clientId)
      .select()
      .single();

    if (error) {
      console.error("Error toggling status:", error.message);
      return { success: false, error: error.message };
    }

    revalidatePath("/home/clients");
    return { success: true, data };
    
  } catch (error) {
    console.error("Unexpected error in toggleClientStatusAction:", error);
    return { success: false, error: "Failed to toggle status" };
  }
};

/**
 * DELETE CLIENT ACTION - Simplified with better cleanup
 */
export const deleteClientAction = async (clientId: string): Promise<ActionResult> => {
  try {
    const supabase = await createClientServerComponent();

    // Get client data to check for logo
    const { data: client, error: fetchError } = await supabase
      .from("clients")
      .select("company_logo")
      .eq("id", clientId)
      .single();

    if (fetchError) {
      console.error("Error fetching client:", fetchError.message);
      return { success: false, error: fetchError.message };
    }

    // Delete logo if exists
    if (client?.company_logo) {
      await deleteImage(client.company_logo);
    }

    // Delete client record
    const { error: deleteError } = await supabase
      .from("clients")
      .delete()
      .eq("id", clientId);

    if (deleteError) {
      console.error("Error deleting client:", deleteError.message);
      return { success: false, error: deleteError.message };
    }

    revalidatePath("/home/clients");
    return { success: true };
    
  } catch (error) {
    console.error("Unexpected error in deleteClientAction:", error);
    return { success: false, error: "Failed to delete client" };
  }
};

// Move fetchCountry to the hook - removed from here to eliminate server action dependency