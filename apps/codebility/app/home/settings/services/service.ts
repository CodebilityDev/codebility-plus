"use server";

import { createServer } from "@/utils/supabase";

export const getAllServices = async () => {
    const supabase = createServer();
    const { data, error } = await supabase
        .from("services")
        .select("*");

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

    return { success: true, data };
}
