"use server";

import { redirect } from "next/navigation";
import { useUserStore } from "@/store/codev-store";
import { Codev } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";
import { uploadNdaToStorage, updateCodevNdaUrls } from "@/utils/ndaStorageService";

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

    const supabase = await createClientServerComponent();

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

export const signupUser = async (formData: FormData) => {
  try {
    const supabase = await createClientServerComponent();
    const setUser = useUserStore.getState().setUser;

    // Extract form data with proper typing and convert email to lowercase
    const rawEmail = formData.get("email_address") as string;
    const email_address = rawEmail.toLowerCase();
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;
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

    // Extract user names for NDA processing
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;

    // Check for an existing user (comparing lowercase email)
    const { data: existingUser } = await supabase
      .from("codev")
      .select("email_address")
      .eq("email_address", email_address)
      .single();

    if (existingUser) {
      return { success: false, error: "Email already exists" };
    }

    if (username) {
      // Validate username format
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.valid) {
        return { success: false, error: usernameValidation.error };
      }

      // Check if username is already taken (case-insensitive)
      const { data: existingUsername } = await supabase
        .from("codev")
        .select("username")
        .ilike("username", username)
        .single();

      if (existingUsername) {
        return { success: false, error: "Username is already taken" };
      }
    }
    // Handle profile image upload if provided
    const image_url = profileImage && profileImage.size > 0
      ? await uploadProfileImage(profileImage, "profileImage", "codebility")
      : null;

    // Create auth user
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://www.codebility.tech' 
      : process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000';
      
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signUp({
      email: email_address,
      password,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
      },
    });

    if (authError) throw authError;
    if (!user) throw new Error("Failed to create user");

    // **ENHANCED NDA PROCESSING WITH STORAGE SYSTEM**
    let nda_status = false;
    let nda_signature: string | undefined = undefined;
    let nda_document: string | undefined = undefined;
    let nda_signed_at: string | undefined = undefined;
    let ndaProcessedWithStorage = false;

    // Check if NDA data was included in the form submission
    const ndaSigned = formData.get("ndaSigned") as string;
    const signature = formData.get("ndaSignature") as string;
    const document = formData.get("ndaDocument") as string;
    const signedAt = formData.get("ndaSignedAt") as string;

    if (ndaSigned === "true" && signature && document) {
      console.log("NDA data found in form submission, processing with storage system...");
      
      try {
        // **NEW: Upload NDA files to Supabase Storage instead of storing base64**
        const ndaUploadResult = await uploadNdaToStorage(
          signature,
          document,
          {
            first_name: firstName,
            last_name: lastName,
            codev_id: user.id, // Use the newly created user ID
          }
        );

        if (ndaUploadResult.success) {
          console.log("NDA files uploaded to storage successfully");
          
          // Set the storage URLs instead of base64 data
          nda_status = true;
          nda_signature = ndaUploadResult.signatureUrl;
          nda_document = ndaUploadResult.documentUrl;
          nda_signed_at = new Date().toISOString();
          ndaProcessedWithStorage = true;
          
          console.log(`NDA stored in Supabase Storage:
            - Signature: ${ndaUploadResult.signatureUrl}
            - Document: ${ndaUploadResult.documentUrl}`);
        } else {
          console.error("Failed to upload NDA to storage:", ndaUploadResult.error);
          
          // **FALLBACK: Use base64 storage if storage upload fails**
          console.log("Falling back to base64 storage for NDA data");
          nda_status = true;
          nda_signature = signature;
          nda_document = document;
          nda_signed_at = signedAt || new Date().toISOString();
        }
      } catch (ndaError) {
        console.error("Error processing NDA with storage system:", ndaError);
        
        // **FALLBACK: Use base64 storage if there's an error**
        console.log("Falling back to base64 storage due to error");
        nda_status = true;
        nda_signature = signature;
        nda_document = document;
        nda_signed_at = signedAt || new Date().toISOString();
      }
    }

    // Prepare user data for insertion into the "codev" table
    const userData: Codev = {
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      email_address,
      username: username || null, // ADDED: Store username if provided, otherwise null
      username_updated_at: username ? new Date().toISOString() : null, // ADDED: Track when username was set
      phone_number: formData.get("phone_number") as string,
      address: null,
      about: (formData.get("about") as string) || null,
      positions: formattedPositions || [],
      display_position: display_position || "",
      portfolio_website: (formData.get("portfolio_website") as string) || null,
      tech_stacks: tech_stacks as string[],
      image_url,
      availability_status: true,
      nda_status,
      nda_signature,
      nda_document,
      nda_signed_at,
      level: {},
      application_status: "applying",
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
      date_applied: new Date().toISOString(),
    };

    // Insert user data into the "codev" table
    const { error: insertError } = await supabase
      .from("codev")
      .insert([userData]);

    if (insertError) throw insertError;

    // Create applicant entry
    const { error } = await supabase
      .from("applicant")
      .insert({
        codev_id: user.id
      });

    if (error) {
      throw error;
    }

    setUser(userData);
    
    // **ENHANCED: Return additional information about NDA processing**
    const responseMessage = ndaProcessedWithStorage 
      ? "Account created successfully! NDA files securely stored. Redirecting to sign-in page..."
      : "Account created successfully! Redirecting to sign-in page...";
    
    console.log(`Signup completed for ${email_address}:
      - User ID: ${user.id}
      - NDA Status: ${nda_status}
      - NDA Storage Method: ${ndaProcessedWithStorage ? 'Supabase Storage' : 'Database'}
      - Profile Image: ${image_url ? 'Uploaded' : 'None'}`);
    
    return { 
      success: true, 
      data: user, 
      ndaProcessed: nda_status,
      ndaStorageMethod: ndaProcessedWithStorage ? 'storage' : 'database',
      message: responseMessage
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
  const supabase = await createClientServerComponent();
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

    // Determine redirect path based on application status
    let redirectTo = "/home"; // Default for "passed" status

    if (
      userProfile.application_status === "applying" ||
      userProfile.application_status === "pending" ||
      userProfile.application_status === "testing" ||
      userProfile.application_status === "onboarding" ||
      userProfile.application_status === "waitlist"
    ) {
      redirectTo = "/applicant/waiting";
    } else if (
      userProfile.application_status === "failed" ||
      userProfile.application_status === "denied"
    ) {
      redirectTo = "/auth/declined";
    }

    return { success: true, redirectTo };
  } catch (error: any) {
    console.error("Sign in error:", error);
    return { success: false, error: error.message || "Failed to sign in" };
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const supabase = await createClientServerComponent();
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

export const resendVerificationEmail = async (email: string) => {
  try {
    const supabase = await createClientServerComponent();
    
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();
    
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://www.codebility.tech' 
      : process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000';

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
      }
    });

    if (error) {
      console.error("Error resending verification email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, message: "Verification email sent successfully" };
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return { 
      success: false, 
      error: error.message || "Failed to resend verification email" 
    };
  }
};