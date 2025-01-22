"use server";

import { cookies } from "next/headers";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

const uploadProfileImage = async (
  file: File,
  folderName: string,
  bucketName: string,
): Promise<string | null> => {
  try {
    if (!file) return null;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}.${extension}`;

    const supabase = await getSupabaseServerActionClient();

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(`${folderName}/${filename}`, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error(`Failed to upload ${file.name}:`, error.message);
      return null;
    }

    const { data: imageData } = supabase.storage
      .from("profiles")
      .getPublicUrl(`avatars/${filename}`);

    return imageData?.publicUrl || null;
  } catch (error) {
    console.error("Error in upload image:", error);
    throw error;
  }
};

export const signupUser = async (formData: FormData) => {
  try {
    const supabase = getSupabaseServerActionClient();

    // Extract form data
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const email_address = formData.get("email_address") as string;
    const password = formData.get("password") as string;
    const phone_number = formData.get("phone_number") as string;
    const years_of_experience = formData.get("years_of_experience") as string;
    const portfolio_website = formData.get("portfolio_website") as string;
    const tech_stacks = formData.get("techstack") as string;
    const position = formData.get("position") as string;
    const facebook_link = formData.get("facebook_link") as string;
    const github = formData.get("github") as string;
    const linkedin = formData.get("linkedin") as string;
    const discord = formData.get("discord") as string;
    const profileImage = formData.get("profileImage") as File;

    // Check if email exists
    const { data: existingUser } = await supabase
      .from("codev")
      .select("email_address")
      .eq("email_address", email_address)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: "Email already exists",
      };
    }

    // Upload profile image if provided
    let image_url = null;
    if (profileImage) {
      image_url = await uploadProfileImage(profileImage, "avatars", "profiles");
    }

    // Create auth user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signUp({
      email: email_address,
      password: password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/callback`,
      },
    });

    if (authError) throw authError;

    if (!user) {
      throw new Error("Failed to create user");
    }

    // Prepare user data
    const userData = {
      id: user.id,
      first_name,
      last_name,
      email_address,
      phone_number,
      portfolio_website,
      tech_stacks: tech_stacks.split(", "),
      display_position: position,
      positions: [position],
      years_of_experience: parseInt(years_of_experience),
      facebook_link,
      linkedin,
      github,
      discord,
      image_url,
      application_status: "applying",
      availability_status: "available",
      nda_status: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert into codev table
    const { error: insertError } = await supabase
      .from("codev")
      .insert([userData]);

    if (insertError) throw insertError;

    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    console.error("Signup error:", error);
    return {
      success: false,
      error: error.message || "Failed to create account",
    };
  }
};

export const signinUser = async (email: string, password: string) => {
  const supabase = getSupabaseServerActionClient();

  try {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) throw signInError;
    if (!signInData.user) throw new Error("Failed to sign in");

    // Check email verification
    const isEmailVerified = signInData.user.user_metadata?.email_verified;

    if (!isEmailVerified) {
      throw new Error(
        "Please verify your email first. Check your inbox for the verification link.",
      );
    }

    // Check application status
    const { data: userProfile, error: profileError } = await supabase
      .from("codev")
      .select("application_status")
      .eq("email_address", email)
      .single();

    if (profileError) throw profileError;
    if (!userProfile) throw new Error("Account not found");

    // Set auth cookie regardless of status
    const cookieStore = cookies();
    cookieStore.set(
      "supabase-user",
      JSON.stringify({
        id: signInData.user.id,
        email: signInData.user.email,
      }),
    );

    // Return appropriate redirect based on status
    switch (userProfile.application_status.toLowerCase()) {
      case "applying":
        return { redirectTo: "/auth/waiting" };
      case "rejected":
        return { redirectTo: "/auth/declined" };
      case "passed":
        return { redirectTo: "/home" };
      default:
        throw new Error("Invalid application status");
    }
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw error;
  }
};

// Function to sign out the user
export const signOut = async (): Promise<void> => {
  try {
    const supabase = getSupabaseServerActionClient();

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(`Sign out error: ${error.message}`);
    }

    // Clear cookies
    const cookieStore = cookies();
    cookieStore.delete("supabase-user");
    console.log("User successfully signed out");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};
