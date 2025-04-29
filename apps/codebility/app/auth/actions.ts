"use server";

import { redirect } from "next/navigation";
import { useUserStore } from "@/store/codev-store";
import { Codev } from "@/types/home/codev";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

const uploadProfileImage = async (
  file: File,
  folderName: string,
  bucketName: string,
): Promise<string | null> => {
  try {
    if (!file) {
      console.error("No file provided for upload.");
      return null;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `${timestamp}.${extension}`;

    const supabase = await getSupabaseServerActionClient();

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(`${folderName}/${filename}`, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error(`Failed to upload ${file.name}:`, uploadError.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`${folderName}/${filename}`);

    return publicUrlData.publicUrl || null;
  } catch (error) {
    console.error("Error during upload:", error);
    throw error;
  }
};

export const signupUser = async (formData: FormData) => {
  try {
    const supabase = getSupabaseServerActionClient();
    const setUser = useUserStore.getState().setUser;

    // Extract form data with proper typing and convert email to lowercase
    const rawEmail = formData.get("email_address") as string;
    const email_address = rawEmail.toLowerCase(); // Normalize the email to lowercase
    const password = formData.get("password") as string;
    const tech_stacks = JSON.parse(formData.get("tech_stacks") as string) || [];
    const positions: { id: number; name: string }[] =
      (JSON.parse(formData.get("positions") as string) as {
        id: number;
        name: string;
      }[]) || [];
    const formattedPositions: string[] = positions.map((item) =>
      JSON.stringify(item),
    );
    const display_position: string = positions[0]?.name || "";
    const years_of_experience =
      parseInt(formData.get("years_of_experience") as string) || 0;
    const profileImage = formData.get("profileImage") as File;

    // Check for an existing user (comparing lowercase email)
    const { data: existingUser } = await supabase
      .from("codev")
      .select("email_address")
      .eq("email_address", email_address)
      .single();

    if (existingUser) {
      return { success: false, error: "Email already exists" };
    }

    // Handle profile image upload if provided
    const image_url = profileImage
      ? await uploadProfileImage(profileImage, "profileImage", "codebility")
      : null;

    // Create auth user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signUp({
      email: email_address,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/callback`,
      },
    });

    if (authError) throw authError;
    if (!user) throw new Error("Failed to create user");

    // Prepare user data for insertion into the "codev" table
    const userData: Codev = {
      id: user.id,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email_address, // already normalized to lowercase
      phone_number: formData.get("phone_number") as string,
      address: null,
      about: (formData.get("about") as string) || null,
      positions: formattedPositions || [],
      display_position: display_position || "",
      portfolio_website: (formData.get("portfolio_website") as string) || null,
      tech_stacks: tech_stacks as string[],
      image_url,
      availability_status: true,
      nda_status: !!formData.get("ndaSigned"),
      level: {},
      application_status: "applying", // Matches DB constraint
      rejected_count: 0,
      facebook: (formData.get("facebook") as string) || null,
      linkedin: (formData.get("linkedin") as string) || null,
      github: (formData.get("github") as string) || null,
      discord: (formData.get("discord") as string) || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      years_of_experience,
      role_id: 7,
      internal_status: "TRAINING",

      // --- NDA fields ---
      nda_signature:
        typeof formData.get("ndaSignature") === "string"
          ? (formData.get("ndaSignature") as string)
          : undefined,
      nda_signed_at:
        typeof formData.get("ndaSignedAt") === "string"
          ? (formData.get("ndaSignedAt") as string)
          : undefined,

      date_applied: new Date().toISOString(),

    };

    // Insert user data into the "codev" table
    const { error: insertError } = await supabase
      .from("codev")
      .insert([userData]);

    if (insertError) throw insertError;

    setUser(userData);
    return { success: true, data: user };
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
  const setUser = useUserStore.getState().setUser;

  // Standardize the email for comparison (assuming emails are stored in lowercase)
  const normalizedEmail = email.toLowerCase();

  try {
    // Sign in with email and password
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

    if (signInError) throw signInError;
    if (!signInData.user) throw new Error("Failed to sign in");

    const { data: userProfile, error: profileError } = await supabase
      .from("codev")
      .select("*")
      .eq("email_address", normalizedEmail)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!userProfile) throw new Error("Account not found");

    // Save the user profile to your store
    setUser(userProfile);

    return { success: true, redirectTo: "/home" };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { success: false, error: error.message || "Failed to sign in" };
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const supabase = getSupabaseServerActionClient();
    const clearUser = useUserStore.getState().clearUser;

    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(`Sign out error: ${error.message}`);

    clearUser();
    console.log("User successfully signed out");
    // Redirect to the /codev page
    redirect("/codev");
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};
