"use server"

import { z } from "zod";
import { createServer } from "@/utils/supabase";
import { revalidatePath } from "next/cache";
import { clientSchema } from "./_lib/schema";

export const createClientAction = async (data: z.infer<typeof clientSchema>) => {
    const supabase = await createServer();

    const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .insert({
            name: data.name,
            logo: data.logo,
            location: data.location,
            email: data.email,
            contact_number: data.contact_number,
            linkedin_link: data.linkedin_link,
            start_time: data.start_time,
            end_time: data.end_time,
        })
        .single();

    if (clientsError) {
        console.error("Error creating clients:", clientsError.message);
        return { success: false, error: clientsError.message };
    }

    revalidatePath("/home/clients");
    return { success: true, clientsData };
};

export const updateClientAction = async (id: number, data: z.infer<typeof clientSchema>) => {
    const supabase = await createServer();

    const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .update({
            name: data.name,
            logo: data.logo,
            location: data.location,
            email: data.email,
            contact_number: data.contact_number,
            linkedin_link: data.linkedin_link,
            start_time: data.start_time,
            end_time: data.end_time,
        })
        .eq("id", id)
        .single();

    if (clientsError) {
        console.error("Error updating clients:", clientsError.message);
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

    const { error: deleteClientError } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

    if (deleteClientError) {
        console.error("Error deleting client:", deleteClientError.message);
        return { success: false, error: deleteClientError.message };
    }

    revalidatePath("/home/clients");
    return { success: true };
};
