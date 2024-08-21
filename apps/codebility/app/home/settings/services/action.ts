"use server";

import { createServer } from "@/utils/supabase";
import { revalidatePath } from "next/cache";

export const services = async () => {
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
    const { data, error } = await supabase.from("services").select("*").eq("id", serviceId).single();

    if (error) {
        console.log("Error getting service: ", error.message);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export const createServices = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const main_image = formData.get("mainImage") as string;
    const picture_1 = formData.get("picture1") as string;
    const picture_2 = formData.get("picture2") as string;
    const user_id = formData.get("userId") as string;

    const supabase = await createServer();
    const { data, error } = await supabase.from("services").insert({ name, description, category, main_image, picture_1, picture_2, user_id }).single();

    if (error) {
        console.log("Error creating services: ", error.message);
        return { success: false, error: error.message };
    }

    revalidatePath("/");
    return { success: true, data };
};

export const deleteService = async (formData: FormData) => {
    const id = formData.get("id") as string;

    const supabase = await createServer();
    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
        console.log("Error deleting service: ", error.message);
        return { success: false, error: error.message };
    }

    revalidatePath("/");
    return { success: true };
};

export const updateService = async (formData: FormData) => {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const main_image = formData.get("mainImage") as string;
    const picture_1 = formData.get("picture1") as string;
    const picture_2 = formData.get("picture2") as string;
    const user_id = formData.get("userId") as string;

    const supabase = await createServer();
    const { error } = await supabase.from("services").update({ name, description, category, main_image, picture_1, picture_2, user_id }).eq("id", id);

    if (error) {
        console.log("error updating service: ", error.message);
        return { success: false, error: error.message };
    }

	revalidatePath("/");
    return { success: true };
};