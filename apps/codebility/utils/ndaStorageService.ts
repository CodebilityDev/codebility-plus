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
 * @param dataUrl - Base64 data URL from canvas or PDF
 * @param filename - Name for the file
 * @param mimeType - MIME type of the file
 */
function dataUrlToFile(dataUrl: string, filename: string, mimeType: string): File {
  const arr = dataUrl.split(',');
  
  // Validate data URL format
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
 * Server-side file upload function following your existing pattern
 * @param file - File to upload
 * @param options - Upload configuration options
 */
async function uploadFileToStorage(
  file: File,
  options: UploadImageOptions
): Promise<string> {
  const supabase = await createClientServerComponent();
  
  try {
    const { bucket = "codebility", folder = "nda", cacheControl = "3600", upsert = true } = options;

    // Generate a cleaner file path following your pattern
    const fileExtension = file.name.split(".").pop() || "";
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl,
        upsert,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    return publicUrlData.publicUrl.toString();

  } catch (error) {
    console.error("File upload failed:", error);
    throw error;
  }
}

/**
 * Generates complete NDA PDF with signature using jsPDF (client-side function)
 * This function needs to be called from client component since jsPDF requires browser environment
 * @param userData - User information for the document
 * @param signatureDataUrl - Base64 signature image
 */
export function generateNdaPdf(userData: UserData, signatureDataUrl: string): Promise<string> {
  // This function should be called from client-side component
  // Moving PDF generation logic to client component since jsPDF requires browser environment
  throw new Error("generateNdaPdf must be called from client component");
}

/**
 * Server action to upload NDA files to Supabase Storage
 * @param signatureDataUrl - Base64 signature from canvas
 * @param documentDataUrl - Base64 PDF document
 * @param userData - User information for file naming
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
      bucket: "codebility",
      folder: "nda/signatures",
    });

    // Upload document to Supabase Storage  
    const documentUrl = await uploadFileToStorage(documentFile, {
      bucket: "codebility", 
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
 * Server action to update codev record with NDA URLs after successful storage upload
 * @param codevId - ID of the codev record to update
 * @param signatureUrl - URL of stored signature file
 * @param documentUrl - URL of stored document file
 */
export async function updateCodevNdaUrls(
  codevId: string,
  signatureUrl: string,
  documentUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClientServerComponent();
    
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
    console.error("Error updating codev NDA URLs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update database",
    };
  }
}

/**
 * Complete NDA signing workflow - uploads to storage then updates database
 * @param signatureDataUrl - Base64 signature from canvas
 * @param documentDataUrl - Base64 PDF document  
 * @param userData - User information including codev_id
 */
export async function completeNdaSigning(
  signatureDataUrl: string,
  documentDataUrl: string, 
  userData: UserData
): Promise<{ success: boolean; error?: string }> {
  
  if (!userData.codev_id) {
    return { success: false, error: "Codev ID is required" };
  }

  // Step 1: Upload files to storage
  const uploadResult = await uploadNdaToStorage(signatureDataUrl, documentDataUrl, userData);
  
  if (!uploadResult.success) {
    return { 
      success: false, 
      error: uploadResult.error || "Failed to upload files to storage" 
    };
  }

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

  return { success: true };
}

/**
 * Server action to delete NDA files from storage
 * @param filePath - Path to the file in storage
 * @param bucket - Storage bucket name
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
 * @param url - Full storage URL
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