"use server";

import { AuthorizationError, requireIdentity } from "@/lib/global/authorize";
import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import type { UploadImageOptions, NdaUploadResult, UserData } from "@/types/global/actions";
import { updateTag } from "next/cache";


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
    const { bucket = "documents", folder = "nda", cacheControl = "3600", upsert = true } = options;

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `${folder}/${fileName}`;

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

    return filePath;

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
    const userIdentifier = codev_id ?? `${first_name}_${last_name}`;
    
    const signatureFilename = `nda_signature_${userIdentifier}_${timestamp}.png`;
    const documentFilename = `nda_document_${userIdentifier}_${timestamp}.pdf`;

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

    // Upload signature to Supabase Storage
    const signatureUrl = await uploadFileToStorage(signatureFile, {
      bucket: "documents",
      folder: "nda/signatures",
    });

    const documentUrl = await uploadFileToStorage(documentFile, {
      bucket: "documents",
      folder: "nda/documents",
    });

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
 * Complete NDA signing workflow - uploads to storage then updates database
 */
export async function completeNdaSigning(
  signatureDataUrl: string,
  documentDataUrl: string,
  userData: UserData,
  token: string,
): Promise<{ success: boolean; error?: string }> {
  
  if (!userData.codev_id) {
    return { success: false, error: "Codev ID is required" };
  }

  try {
    // Step 1: Upload files to storage
    const uploadResult = await uploadNdaToStorage(signatureDataUrl, documentDataUrl, userData);
    
    if (!uploadResult.success) {
      return { 
        success: false, 
        error: uploadResult.error ?? "Failed to upload files to storage" 
      };
    }

    const supabase = await createClientServerComponent();
    const { data: signed, error: recordError } = await supabase.rpc("sign_nda", {
      p_token: token,
      p_signature_url: uploadResult.signatureUrl,
      p_document_url: uploadResult.documentUrl,
    });

    if (recordError) {
      console.error("Error recording NDA signature:", recordError);
      return { success: false, error: recordError.message };
    }

    if (!signed) {
      return { success: false, error: "NDA link is invalid or expired" };
    }

    updateTag(CACHE_TAGS.profileDetail);
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
  bucket = "codebility"
): Promise<boolean> {
  const identity = await requireIdentity();

  if (!filePath.includes(identity.userId)) {
    throw new AuthorizationError("forbidden", "Forbidden: not your file");
  }

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
    return Promise.resolve(pathParts.slice(6).join("/"));
  } catch {
    return Promise.resolve(null);
  }
}
