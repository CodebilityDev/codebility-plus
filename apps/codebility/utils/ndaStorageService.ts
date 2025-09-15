// utils/ndaStorageService.ts
"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

interface UploadImageOptions {
  bucket?: string;
  folder?: string;
  cacheControl?: string;
  upsert?: boolean;
}

interface NdaUploadResult {
  signatureUrl: string;
  documentUrl: string;
  success: boolean;
  error?: string;
}

interface UserData {
  first_name: string;
  last_name: string;
  codev_id?: string;
}

/**
 * Converts data URL to File object for uploading
 */
function dataUrlToFile(dataUrl: string, filename: string, mimeType: string): File {
  const arr = dataUrl.split(',');
  
  if (arr.length !== 2) {
    throw new Error('Invalid data URL format');
  }
  
  const base64Data = arr[1];
  if (!base64Data) {
    throw new Error('No base64 data found in data URL');
  }
  
  try {
    const bstr = atob(base64Data);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mimeType });
  } catch (error) {
    throw new Error(`Failed to decode base64 data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Server-side file upload function
 */
async function uploadFileToStorage(
  file: File,
  options: UploadImageOptions
): Promise<string> {
  const supabase = await createClientServerComponent();
  
  try {
    const { bucket = "codebility", folder = "nda", cacheControl = "3600", upsert = true } = options;

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop() || "";
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `${folder}/${fileName}`;

    console.log(`Uploading file to: ${bucket}/${filePath}`);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl,
        upsert,
      });

    if (uploadError) {
      console.error(`Upload error for ${filePath}:`, uploadError);
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    console.log(`File uploaded successfully: ${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl.toString();

  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
}

/**
 * Server action to upload NDA files to Supabase Storage
 */
export async function uploadNdaToStorage(
  signatureDataUrl: string,
  documentDataUrl: string,
  userData: UserData
): Promise<NdaUploadResult> {
  try {
    const { first_name, last_name, codev_id } = userData;
    
    // Generate unique filenames with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const userIdentifier = codev_id || `${first_name}_${last_name}`;
    
    const signatureFilename = `nda_signature_${userIdentifier}_${timestamp}.png`;
    const documentFilename = `nda_document_${userIdentifier}_${timestamp}.pdf`;

    console.log(`Processing NDA upload for user: ${first_name} ${last_name}`);

    // Convert data URLs to File objects
    const signatureFile = dataUrlToFile(
      signatureDataUrl, 
      signatureFilename, 
      'image/png'
    );

    const documentFile = dataUrlToFile(
      documentDataUrl, 
      documentFilename, 
      'application/pdf'
    );

    console.log(`Files created - Signature: ${signatureFile.size} bytes, Document: ${documentFile.size} bytes`);

    // Upload signature to Supabase Storage
    const signatureUrl = await uploadFileToStorage(signatureFile, {
      bucket: "codebility",
      folder: "nda/signatures",
    });

    // Upload document to Supabase Storage  
    const documentUrl = await uploadFileToStorage(documentFile, {
      bucket: "codebility", 
      folder: "nda/documents",
    });

    console.log(`NDA files uploaded successfully for ${userIdentifier}`);

    return {
      signatureUrl,
      documentUrl,
      success: true,
    };

  } catch (error) {
    console.error("Error uploading NDA to storage:", error);
    return {
      signatureUrl: "",
      documentUrl: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Server action to update codev record with NDA URLs after successful storage upload
 */
export async function updateCodevNdaUrls(
  codevId: string,
  signatureUrl: string,
  documentUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClientServerComponent();
    
    console.log(`Updating database for codev ${codevId} with storage URLs`);
    
    const { error } = await supabase
      .from("codev")
      .update({
        nda_signature: signatureUrl,
        nda_document: documentUrl,
        nda_status: true,
        nda_signed_at: new Date().toISOString(),
      })
      .eq("id", codevId);

    if (error) {
      console.error(`Database update error for ${codevId}:`, error);
      throw error;
    }

    console.log(`Database updated successfully for codev ${codevId}`);

    // Revalidate the in-house page to show updated NDA status
    revalidatePath("/home/in-house");

    return { success: true };
  } catch (error) {
    console.error("Error updating codev NDA URLs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update database",
    };
  }
}

/**
 * Complete NDA signing workflow - uploads to storage then updates database
 */
export async function completeNdaSigning(
  signatureDataUrl: string,
  documentDataUrl: string, 
  userData: UserData
): Promise<{ success: boolean; error?: string }> {
  
  if (!userData.codev_id) {
    return { success: false, error: "Codev ID is required" };
  }

  console.log(`Starting complete NDA signing process for ${userData.first_name} ${userData.last_name}`);

  try {
    // Step 1: Upload files to storage
    const uploadResult = await uploadNdaToStorage(signatureDataUrl, documentDataUrl, userData);
    
    if (!uploadResult.success) {
      return { 
        success: false, 
        error: uploadResult.error || "Failed to upload files to storage" 
      };
    }

    console.log(`Storage upload completed, updating database for codev ${userData.codev_id}`);

    // Step 2: Update database with URLs
    const dbResult = await updateCodevNdaUrls(
      userData.codev_id,
      uploadResult.signatureUrl,
      uploadResult.documentUrl
    );

    if (!dbResult.success) {
      return { 
        success: false, 
        error: dbResult.error || "Failed to update database" 
      };
    }

    console.log(`NDA signing process completed successfully for ${userData.codev_id}`);
    return { success: true };

  } catch (error) {
    console.error("Error in complete NDA signing:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to complete NDA signing process"
    };
  }
}

/**
 * Server action to delete NDA files from storage (cleanup utility)
 */
export async function deleteNdaFile(
  filePath: string,
  bucket: string = "codebility"
): Promise<boolean> {
  const supabase = await createClientServerComponent();
  
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error("NDA file deletion failed:", error);
    throw error;
  }
}

/**
 * Helper function to extract file path from storage URL
 */
export async function getNdaFilePath(url: string): Promise<string | null> {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    // Remove the bucket name and 'object' from the path
    return pathParts.slice(6).join("/");
  } catch {
    return null;
  }
}