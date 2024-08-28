"use server";

import { createServer } from "@/utils/supabase";
import { revalidatePath } from "next/cache";

export const uploadImage = async (file: File | null, folderName: string, bucketName: string) => {
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
    return data.path;
};

export const services = async () => {
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

export const createServices = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const mainImage = formData.get("mainImage") as File | null;
    const picture1 = formData.get("picture1") as File | null;
    const picture2 = formData.get("picture2") as File | null;
    const userId = formData.get("userId") as string;

    const supabase = await createServer();

    const mainImagePath = await uploadImage(mainImage, "public", "services-image");
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
            main_image: mainImagePath,
            picture_1: picture1Path,
            picture_2: picture2Path,
            user_id: userId
        })
        .single();

    if (servicesError) {
        console.error("Error creating services:", servicesError.message);
        return { success: false, error: servicesError.message };
    }

    revalidatePath("/home/settings/services");
    return { success: true, servicesData };
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

export const deleteService = async (formData: FormData) => {
    const id = formData.get("id") as string;

    const supabase = await createServer();

    const { data: service, error: serviceError } = await supabase
        .from("services")
        .select("main_image, picture_1, picture_2")
        .eq("id", id)
        .single();

    if (serviceError || !service) {
        console.error("Error fetching service:", serviceError?.message);
        return { success: false, error: serviceError?.message || "Service not found" };
    }

    const imagePaths = [service.main_image, service.picture_1, service.picture_2].filter(Boolean);

    const deleteImagePromises = imagePaths.map(async (path) => {
        const filePath = path.replace("public/", "");
        const { error: storageError } = await supabase.storage
            .from("services-image")
            .remove([`public/${filePath}`]);

        if (storageError) {
            console.error("Error deleting image:", storageError.message);
        } else {
            console.log("Image deleted successfully:", filePath);
        }
    });

    await Promise.all(deleteImagePromises);

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