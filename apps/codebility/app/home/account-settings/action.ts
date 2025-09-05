"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const updatePassword = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    const supabase = await createClientServerComponent();

    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (signInError) {
        console.log("error message: ", signInError.message);
        return { succes: false, error: signInError.message };
    }

    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (updateError) {
        console.log("Error updating password: ", updateError.message);
        return { success: false, error: updateError.message };
    }

    revalidatePath("/account-settings");
    return { success: true };
};