"use server"

import { createServer } from "@/utils/supabase";
import { revalidatePath } from "next/cache";

export const uploadImage = async (file: File, folderName: string, bucketName: string): Promise<string | null> => {
    try {
        if (!file) {
            console.error("No file provided for upload");
            return null;
        }
        console.log("Uploading file:", file.name, "Size:", file.size, "Type:", file.type);
    
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
    
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const extension = file.name.split(".").pop();
        const filename = `${timestamp}.${extension}`;
    
        const supabase = await createServer();
    
        const { data, error } = await supabase
            .storage
            .from(bucketName)
            .upload(`${folderName}/${filename}`, buffer, {
                contentType: file.type,
            });
    
        if (error) {
            console.error(`Failed to upload ${file.name}:`, error.message);
            return null;
        }
    
        console.log("File uploaded successfully:", data.path);
        return data.path ?? null;
    } catch (error) {
        console.error("Error in upload image:", error);
        throw error;
    }
};

export const deleteImage = async (path: string) => {
    try {
        const filePath = path.replace("public/", "");
        console.log("File path: ", filePath);

        if (!filePath) {
            throw new Error("File path could not be extracted from URL");
        }

        const supabase = await createServer();

        const { error } = await supabase.storage
            .from("clients-image")
            .remove([`public/${filePath}`]);

        if (error) {
            return { success: false, error: error.message };
        }

        console.log(`Image deleted successfully`);
    } catch (error) {
        console.error("Error deleting image:", error);
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

    const supabase = await createServer();

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

export const updateClientAction = async (id: number, formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const location = formData.get("location") as string;
    const contact_number = formData.get("contact_number") as string;
    const linkedin_link = formData.get("linkedin_link") as string;
    const start_time = formData.get("start_time") as string;
    const end_time = formData.get("end_time") as string;
    const logo = formData.get("logo") as File | null;

    const supabase = await createServer();

    const { data: clientData, error: getClientError } = await supabase
        .from("clients")
        .select("logo")
        .eq("id", id)
        .single();

    if (getClientError) {
        console.error("Error fetching client data:", getClientError.message);
        return { success: false, error: getClientError.message };
    }

    await deleteImage(clientData.logo);

    let updatedLogoPath = null;
    if (logo) {
        updatedLogoPath = await uploadImage(logo, "public", "clients-image");
    }

    const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .update({
            name,
            logo: updatedLogoPath,  
            location: location || null, 
            email,
            contact_number: contact_number || null,
            linkedin_link,
            start_time: start_time || null,
            end_time: end_time || null,
        })
        .eq("id", id)
        .single();

    if (clientsError) {
        console.error("Error updating client:", clientsError.message);
        return { success: false, error: clientsError.message };
    }

    revalidatePath("/home/clients");
    return { success: true, clientsData };
};

export const toggleClientArchiveAction = async (id: string) => {
    const supabase = await createServer();

    const { data: client, error: fetchError } = await supabase
        .from("clients")
        .select("is_archive")
        .eq("id", id)
        .single();

    if (fetchError) {
        console.error("Error fetching client data:", fetchError.message);
        return { success: false, error: fetchError.message };
    }

    const newIsArchiveValue = !client.is_archive;

    const { data: updatedClient, error: updateError } = await supabase
        .from("clients")
        .update({ 
            is_archive: newIsArchiveValue 
        })
        .eq("id", id)
        .single();

    if (updateError) {
        console.error("Error updating client:", updateError.message);
        return { success: false, error: updateError.message };
    }

    revalidatePath("/home/clients");
    return { success: true, updatedClient };
};

export const deleteClientAction = async (id: string | number) => {
    const supabase = await createServer();

    const { data: clientData, error: getClientError } = await supabase
        .from("clients")
        .select("logo")
        .eq("id", id)
        .single();

    if (getClientError) {
        console.error("Error fetching client data:", getClientError.message);
        return { success: false, error: getClientError.message };
    }

    await deleteImage(clientData.logo);

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
