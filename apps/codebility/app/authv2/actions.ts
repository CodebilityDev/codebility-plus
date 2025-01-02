"use server";

import { redirect } from "next/navigation";
import pathsConfig from "@/config/paths.config";
import { formatToUnix } from "@/lib/format-date-time";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

const uploadProfileImage = async (
  file: File,
  folderName: string,
  bucketName: string,
): Promise<string | null> => {
  try {
    if (!file) {
      console.error("No file provided for upload");
      return null;
    }
    console.log(
      "Uploading file:",
      file.name,
      "Size:",
      file.size,
      "Type:",
      file.type,
    );

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
  const first_name = formData.get("firstName") as string;
  const last_name = formData.get("lastName") as string;
  const fb_link = formData.get("facebook") as string;
  const email_address = formData.get("email_address") as string;
  const password = formData.get("password") as string;
  const portfolio_website = formData.get("website") as string;
  const tech_stacks = formData.get("techstack") as string;
  const schedule = formData.get("schedule") as string;
  const main_position = formData.get("position") as string;
  const github_link = formData.get("github") as string;
  const profileImage = formData.get("profileImage") as File;

  const supabase = getSupabaseServerActionClient();

  // check first if the user exist
  const { data: userEmail, error: userError } = await supabase
    .from("user")
    .select("email")
    .eq("email", email_address)
    .single();

  if (userError && userError.code !== "PGRST116") {
    console.log("Error fetching user: ", userError.message);
    return { success: false, error: userError.message };
  }

  if (userEmail) {
    console.log("Invalid credentials.");
    return { success: false, error: "Invalid credentials" };
  }

  let profileImagePath = null;
  if (profileImage) {
    profileImagePath = await uploadProfileImage(
      profileImage,
      "avatars",
      "profiles",
    );
  }

  const [startTime, endTime] = schedule.split(" - ");
  const userData = {
    first_name,
    last_name,
    fb_link,
    email_address,
    portfolio_website,
    tech_stacks: [...tech_stacks.split(", ")],
    start_time: formatToUnix(startTime as string),
    end_time: formatToUnix(endTime as string),
    main_position,
    github_link,
    profileImage: profileImagePath,
  };

  const {
    error,
    data: { user },
  } = await supabase.auth.signUp({
    email: email_address,
    password: password,
    options: {
      data: userData,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/authv2/callback`,
    },
  });

  if (error) {
    console.log("Error in registration: ", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: user };
};

export const signinUser = async (email: string, password: string) => {
  const supabase = getSupabaseServerActionClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  redirect(pathsConfig.app.home); // redirect to home after sign in
};

export const signOut = async () => {
  const supabase = getSupabaseServerActionClient();
  await supabase.auth.signOut();
  redirect("/");
};
