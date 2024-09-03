"use server"

import { createServer } from "@/utils/supabase";

export const getAllClients = async () => { 
    const supabase = createServer();
    const { data, error } = await supabase
        .from("clients")
        .select("*");

    if (error) {
        console.error("Error fetching clients:", error.message);
        return { success: false, error: error.message };
    }

    data.forEach(client => {
        if (client.logo) {
            client.logo = supabase.storage.from("clients-image").getPublicUrl(client.logo).data.publicUrl;
        }
    });
    
    return data;
};
