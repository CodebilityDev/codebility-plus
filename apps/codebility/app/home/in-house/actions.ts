// app/home/in-house/actions.ts
"use server";

import { Codev } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Updates codev information with enhanced NDA URL storage support
 * Now properly handles nda_signature and nda_document URL fields
 */
export const updateCodev = async (
  key: keyof Codev,
  value: any,
  { codevId }: { codevId: string },
) => {
  const supabase = await createClientServerComponent();

  // Define keys and their corresponding target tables
  const keys = {
    projects: ["projects"],
    codev: [
      "internal_status",
      "nda_status",
      "nda_signature",      // URL to signature file in storage
      "nda_document",       // URL to document file in storage
      "nda_signed_at",      // Timestamp when NDA was signed
      "nda_request_sent",   // Boolean for tracking email status
      "availability_status",
      "application_status",
      "image_url",
      "email_address",
      "display_position",
      "role_id",
      "level",
      "tech_stacks",
      "first_name",
      "last_name",
      "phone_number",
      "date_joined",
      "portfolio_website",
    ],
  };

  // Dynamically find the target table
  const target = Object.keys(keys).find((table) =>
    keys[table as keyof typeof keys].includes(key),
  );

  if (!target) {
    throw new Error(`Invalid codev info: ${key}`);
  }

  if (target === "projects") {
    // 1) Delete all existing pivot rows for that codev
    const { error: deleteError } = await supabase
      .from("project_members")
      .delete()
      .eq("codev_id", codevId);

    if (deleteError) throw deleteError;

    // 2) Re-insert the new relationships
    for (let i = 0; i < value.length; i++) {
      const project = value[i];

      const insertPayload = {
        codev_id: codevId,
        project_id: project.id,
        role: project.role || "member",
      };

      const { error: insertError } = await supabase
        .from("project_members")
        .insert(insertPayload);

      if (insertError) throw insertError;
    }
  } else {
    // Handle standard update to the 'codev' table
    let newValue = value;

    // Special processing for certain fields
    if (target === "codev") {
      if (["internal_status", "availability_status"].includes(key)) {
        // Convert spaces to no-space uppercase
        newValue = String(newValue).replace(/\s+/g, "").toUpperCase();
      }
      
      // Handle NDA status updates - when NDA is marked as signed
      if (key === "nda_status" && value === true) {
        // Ensure we have the signed timestamp
        const updateData: any = { [key]: newValue };
        
        // If nda_signed_at is not already set, set it now
        const { data: existingRecord } = await supabase
          .from("codev")
          .select("nda_signed_at")
          .eq("id", codevId)
          .single();
          
        if (!existingRecord?.nda_signed_at) {
          updateData.nda_signed_at = new Date().toISOString();
        }
        
        const { error } = await supabase
          .from("codev")
          .update(updateData)
          .eq("id", codevId);

        if (error) throw error;
        return;
      }
    }

    const { error } = await supabase
      .from(target)
      .update({ [key]: newValue })
      .eq("id", codevId);

    if (error) throw error;
  }
  
  // Revalidate the page to reflect changes
  revalidatePath("/home/in-house");
};

/**
 * Server action specifically for updating NDA URLs after storage upload
 * This is called by the NDA signing process to save storage URLs to database
 */
export const updateNdaUrls = async (
  codevId: string,
  signatureUrl: string,
  documentUrl: string
) => {
  const supabase = await createClientServerComponent();

  try {
    const { error } = await supabase
      .from("codev")
      .update({
        nda_signature: signatureUrl,
        nda_document: documentUrl,
        nda_status: true,
        nda_signed_at: new Date().toISOString(),
      })
      .eq("id", codevId);

    if (error) throw error;
    
    // Revalidate the in-house page to show updated NDA status
    revalidatePath("/home/in-house");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating NDA URLs:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update NDA URLs"
    );
  }
};

/**
 * Server action to handle NDA email sending with proper database tracking
 */
export const sendNdaEmailAction = async (
  codevId: string,
  email: string,
  subject: string,
  message: string
) => {
  const supabase = await createClientServerComponent();

  try {
    // Generate unique token with 7-day expiration
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store NDA request in database
    const { error: dbError } = await supabase.from("nda_requests").insert({
      codev_id: codevId,
      token: token,
      expires_at: expiresAt.toISOString(),
      status: "pending",
    });

    if (dbError) throw dbError;

    // Update codev record to mark NDA request as sent
    const { error: updateError } = await supabase
      .from("codev")
      .update({ nda_request_sent: true })
      .eq("id", codevId);

    if (updateError) throw updateError;

    // Generate the NDA signing link
    const signingLink = `${process.env.NEXT_PUBLIC_APP_URL}/nda-signing/${token}`;

    // Get codev data for email
    const { data: codevData, error: fetchError } = await supabase
      .from("codev")
      .select("first_name, last_name")
      .eq("id", codevId)
      .single();

    if (fetchError) throw fetchError;

    // Send email via your email service
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: email,
        subject: subject,
        content: message,
        firstName: codevData?.first_name || "",
        ndaLink: signingLink,
        isNdaEmail: true,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error(await emailResponse.text());
    }

    revalidatePath("/home/in-house");
    return { success: true, token };
  } catch (error) {
    console.error("Error sending NDA email:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to send NDA email"
    );
  }
};

/**
 * Server action to delete a codev member safely
 * Handles foreign key relationships and file cleanup
 */
export const deleteCodevAction = async (codevId: string) => {
  const supabase = await createClientServerComponent();

  try {
    // Get codev data first for cleanup
    const { data: codev, error: fetchError } = await supabase
      .from("codev")
      .select("image_url, nda_signature, nda_document")
      .eq("id", codevId)
      .single();

    if (fetchError) throw fetchError;

    // Clean up storage files if they exist
    if (codev.image_url) {
      try {
        const { deleteImage } = await import("@/utils/uploadImage");
        const imagePath = new URL(codev.image_url).pathname;
        await deleteImage(imagePath, "codebility");
      } catch (cleanupError) {
        console.warn("Failed to delete profile image:", cleanupError);
      }
    }

    if (codev.nda_signature) {
      try {
        const { deleteImage } = await import("@/utils/uploadImage");
        const signaturePath = new URL(codev.nda_signature).pathname;
        await deleteImage(signaturePath, "codebility");
      } catch (cleanupError) {
        console.warn("Failed to delete NDA signature:", cleanupError);
      }
    }

    if (codev.nda_document) {
      try {
        const { deleteImage } = await import("@/utils/uploadImage");
        const documentPath = new URL(codev.nda_document).pathname;
        await deleteImage(documentPath, "codebility");
      } catch (cleanupError) {
        console.warn("Failed to delete NDA document:", cleanupError);
      }
    }

    // Delete related records first (cascade should handle this, but being explicit)
    await supabase.from("project_members").delete().eq("codev_id", codevId);
    await supabase.from("nda_requests").delete().eq("codev_id", codevId);

    // Delete the codev record
    const { error: deleteError } = await supabase
      .from("codev")
      .delete()
      .eq("id", codevId);

    if (deleteError) throw deleteError;

    revalidatePath("/home/in-house");
    return { success: true };
  } catch (error) {
    console.error("Error deleting codev:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete member"
    );
  }
};