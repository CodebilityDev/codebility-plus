// utils/nda-helpers.ts
// Utility functions for NDA localStorage management and form integration

export interface NdaData {
  signed: boolean;
  signature: string | null;
  document: string | null;
  signedAt: string | null;
  firstName: string | null;
  lastName: string | null;
}

/**
 * Check if NDA data exists in localStorage
 * @returns NdaData object with all NDA-related information
 */
export const getNdaDataFromStorage = (): NdaData => {
  if (typeof window === "undefined") {
    return {
      signed: false,
      signature: null,
      document: null,
      signedAt: null,
      firstName: null,
      lastName: null,
    };
  }

  const ndaSigned = localStorage.getItem("ndaSigned");
  const ndaSignature = localStorage.getItem("ndaSignature");
  const ndaDocument = localStorage.getItem("ndaDocument");
  const ndaSignedAt = localStorage.getItem("ndaSignedAt");
  const firstName = localStorage.getItem("ndaUserFirstName");
  const lastName = localStorage.getItem("ndaUserLastName");

  return {
    signed: ndaSigned === "true",
    signature: ndaSignature,
    document: ndaDocument,
    signedAt: ndaSignedAt,
    firstName: firstName,
    lastName: lastName,
  };
};

/**
 * Check if complete NDA data exists in localStorage
 * @returns boolean indicating if NDA is fully signed and stored
 */
export const hasCompleteNdaData = (): boolean => {
  const ndaData = getNdaDataFromStorage();
  return !!(
    ndaData.signed &&
    ndaData.signature &&
    ndaData.document &&
    ndaData.signedAt
  );
};

/**
 * Clean up all NDA-related data from localStorage
 * Should be called after successful database insertion
 */
export const cleanupNdaStorage = (): void => {
  if (typeof window === "undefined") return;

  const keysToRemove = [
    "ndaSigned",
    "ndaSignature",
    "ndaDocument", 
    "ndaSignedAt",
    "ndaUserFirstName",
    "ndaUserLastName"
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log("NDA localStorage data cleaned up successfully");
};

/**
 * Add NDA data to FormData object for server submission
 * @param formData - The FormData object to enhance
 * @returns boolean indicating if NDA data was added
 */
export const appendNdaDataToForm = (formData: FormData): boolean => {
  const ndaData = getNdaDataFromStorage();

  if (hasCompleteNdaData()) {
    formData.append("ndaSigned", "true");
    formData.append("ndaSignature", ndaData.signature!);
    formData.append("ndaDocument", ndaData.document!);
    formData.append("ndaSignedAt", ndaData.signedAt!);
    
    console.log("NDA data appended to form submission");
    return true;
  }

  return false;
};

/**
 * Validate NDA data integrity
 * @returns object with validation status and any error messages
 */
export const validateNdaData = (): { valid: boolean; errors: string[] } => {
  const ndaData = getNdaDataFromStorage();
  const errors: string[] = [];

  if (!ndaData.signed) {
    errors.push("NDA not marked as signed");
  }

  if (!ndaData.signature) {
    errors.push("Signature data missing");
  }

  if (!ndaData.document) {
    errors.push("PDF document missing");
  }

  if (!ndaData.signedAt) {
    errors.push("Signing timestamp missing");
  } else {
    // Validate timestamp format
    const signedDate = new Date(ndaData.signedAt);
    if (isNaN(signedDate.getTime())) {
      errors.push("Invalid signing timestamp format");
    }
  }

  // Check if signature is valid base64 PNG
  if (ndaData.signature) {
    if (!ndaData.signature.startsWith("data:image/png;base64,")) {
      errors.push("Invalid signature format - must be base64 PNG");
    }
  }

  // Check if document is valid base64 PDF
  if (ndaData.document) {
    if (!ndaData.document.startsWith("data:application/pdf;base64,")) {
      errors.push("Invalid document format - must be base64 PDF");
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Get a formatted summary of NDA data for debugging
 * @returns string summary of current NDA status
 */
export const getNdaSummary = (): string => {
  const ndaData = getNdaDataFromStorage();
  const validation = validateNdaData();

  return `
NDA Status Summary:
- Signed: ${ndaData.signed}
- Has Signature: ${!!ndaData.signature}
- Has Document: ${!!ndaData.document}  
- Signed At: ${ndaData.signedAt || 'Not set'}
- First Name: ${ndaData.firstName || 'Not set'}
- Last Name: ${ndaData.lastName || 'Not set'}
- Complete: ${hasCompleteNdaData()}
- Valid: ${validation.valid}
${validation.errors.length > 0 ? `- Errors: ${validation.errors.join(', ')}` : ''}
  `.trim();
};

/**
 * Listen for NDA signing completion from popup window
 * @param callback - Function to call when NDA is signed
 * @returns cleanup function to remove event listener
 */
export const listenForNdaCompletion = (
  callback: (data: { signed: boolean; userData?: any }) => void
): (() => void) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data?.type === "NDA_SIGNED") {
      callback({
        signed: event.data.signed,
        userData: event.data.userData
      });
    }
  };

  window.addEventListener("message", handleMessage);
  
  // Return cleanup function
  return () => {
    window.removeEventListener("message", handleMessage);
  };
};