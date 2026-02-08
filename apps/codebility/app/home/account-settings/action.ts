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




// Username validation function (Instagram-like rules)
const validateUsername = (username: string): { valid: boolean; error?: string } => {
    // Must be 8-30 characters
    if (username.length < 8) {
        return { valid: false, error: "Username must be at least 8 characters" };
    }
    if (username.length > 30) {
        return { valid: false, error: "Username must be 30 characters or less" };
    }

    // Only letters, numbers, periods, and underscores
    const validPattern = /^[a-zA-Z0-9._]+$/;
    if (!validPattern.test(username)) {
        return { valid: false, error: "Username can only contain letters, numbers, periods, and underscores" };
    }

    // Cannot start or end with a period
    if (username.startsWith('.') || username.endsWith('.')) {
        return { valid: false, error: "Username cannot start or end with a period" };
    }

    // Cannot have consecutive periods
    if (username.includes('..')) {
        return { valid: false, error: "Username cannot have consecutive periods" };
    }

    return { valid: true };
};

// Check if username is available
export const checkUsernameAvailability = async (username: string, currentUserId: string) => {
    // Validate format first
    const validation = validateUsername(username);
    if (!validation.valid) {
        return { available: false, error: validation.error };
    }

    const supabase = await createClientServerComponent();

    // Check if username exists (case-insensitive)
    const { data, error } = await supabase
        .from("codev")
        .select("id, username")
        .ilike("username", username)
        .single();

    if (error && error.code !== "PGRST116") { // PGRST116 = no rows returned
        console.error("Error checking username:", error);
        return { available: false, error: "Error checking username availability" };
    }

    // If username exists and it's not the current user's username
    if (data && data.id !== currentUserId) {
        return { available: false, error: "Username is already taken" };
    }

    return { available: true };
};

// Get user's current username data
export const getUsernameData = async (userId: string) => {
    const supabase = await createClientServerComponent();

    const { data, error } = await supabase
        .from("codev")
        .select("username, username_updated_at")
        .eq("id", userId)
        .single();

    if (error) {
        console.error("Error fetching username data:", error);
        return { success: false, error: "Failed to fetch username data" };
    }

    return { success: true, data };
};

// Update username
export const updateUsername = async (userId: string, newUsername: string) => {
    const supabase = await createClientServerComponent();

    // 1. Validate username format
    const validation = validateUsername(newUsername);
    if (!validation.valid) {
        return { success: false, error: validation.error };
    }

    // 2. Get current user data
    const { data: userData, error: fetchError } = await supabase
        .from("codev")
        .select("username, username_updated_at")
        .eq("id", userId)
        .single();

    if (fetchError) {
        console.error("Error fetching user data:", fetchError);
        return { success: false, error: "Failed to fetch user data" };
    }

    // 3. Check 30-day cooldown
    if (userData.username_updated_at) {
        const lastUpdate = new Date(userData.username_updated_at);
        const now = new Date();
        const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSinceUpdate < 30) {
            const daysRemaining = 30 - daysSinceUpdate;
            return { 
                success: false, 
                error: `You can change your username again in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}` 
            };
        }
    }

    // 4. Check if username is available
    const availabilityCheck = await checkUsernameAvailability(newUsername, userId);
    if (!availabilityCheck.available) {
        return { success: false, error: availabilityCheck.error };
    }

    // 5. Update username
    const { error: updateError } = await supabase
        .from("codev")
        .update({ 
            username: newUsername,
            username_updated_at: new Date().toISOString()
        })
        .eq("id", userId);

    if (updateError) {
        console.error("Error updating username:", updateError);
        return { success: false, error: "Failed to update username" };
    }

    revalidatePath("/account-settings");
    return { success: true };
};