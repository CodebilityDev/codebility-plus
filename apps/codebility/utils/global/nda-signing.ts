import { z } from "zod";

// Define the validation schema for user information
export const UserInfoSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});
/**
 * Client-side PDF generation function since jsPDF requires browser environment
 * @param userData - User information for the document
 * @param signatureDataUrl - Base64 signature image
 */
export async function generateNdaPdf(
  userData: { first_name: string; last_name: string },
  signatureDataUrl: string,
  formattedDate: string,
): Promise<string> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  
  const { first_name, last_name } = userData;
  const pageWidth = doc.internal.pageSize.getWidth();
  const lineWidth = 150;

  // Page 1 - Cover and Terms
  doc.setFont("times", "normal");
  doc.setFontSize(16);
  doc.text("COMPANY NDA", 20, 20);
  doc.setFontSize(14);
  doc.setTextColor(0, 128, 0);
  doc.text("CODEBILITY NDA", 20, 30);
  doc.text("CODEBILITY", 20, 40);
  doc.setTextColor(0, 0, 0);

  doc.setFontSize(14);
  doc.text("TERMS OF AGREEMENT", 20, 55);
  doc.setFontSize(10);
  doc.text(
    `This agreement is created on ${formattedDate} and remains in effect indefinitely. The`,
    20, 65
  );
  doc.text(
    "Intern has the flexibility to conclude their tenure at any point, subject to the conditions",
    20, 75
  );
  doc.text("outlined in Termination of Agreement.", 20, 85);

  doc.setFontSize(14);
  doc.text("CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT (NDA):", 20, 100);
  doc.setFontSize(10);
  doc.text(
    "A. The Intern agrees not to disclose, divulge, reveal, report or use, for any purpose, any",
    20, 110
  );
  doc.text(
    "confidential information of Codebility, which the Intern has obtained, or which was",
    20, 120
  );
  doc.text(
    "disclosed to the Intern by Codebility because of this Agreement. The Intern's obligations",
    20, 130
  );
  doc.text(
    "under this Agreement will continue after termination of this Agreement and will be binding",
    20, 140
  );
  doc.text(
    "until the Confidential Information becomes public or until Codebility sends the Intern written",
    20, 150
  );
  doc.text(
    "notice releasing the Intern from this Agreement, whichever occurs first.",
    20, 160
  );

  doc.text(
    "B. Confidential Information refers to any data or information relating to the business",
    20, 175
  );
  doc.text(
    "by Codebility that is not generally known to the public and that, if disclosed, could reasonably",
    20, 185
  );
  doc.text("be expected to cause harm to Codebility.", 20, 195);

  // Add more pages as needed...
  doc.addPage();
  
  // Page 2 - Additional terms
  doc.setFontSize(14);
  doc.text("INTELLECTUAL PROPERTY", 20, 20);
  doc.setFontSize(10);
  doc.text(
    "All intellectual property developed during the internship period belongs to Codebility.",
    20, 30
  );

  doc.addPage();
  
  // Page 3 - More content
  doc.setFontSize(14);
  doc.text("TERMINATION", 20, 20);
  doc.setFontSize(10);
  doc.text(
    "Either party may terminate this Agreement at any time by providing 30 days written notice",
    20, 30
  );
  doc.text("to the other party.", 20, 40);

  doc.addPage();

  // Page 4 - Signatures
  const ceoLineY = 70;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(
    (pageWidth - lineWidth) / 2,
    ceoLineY,
    (pageWidth - lineWidth) / 2 + lineWidth,
    ceoLineY
  );

  doc.text("CEO/FOUNDER of Codebility", pageWidth / 2, ceoLineY - 30, {
    align: "center",
  });
  doc.text("JZEFF KENDREW F SOMERA", pageWidth / 2, ceoLineY + 15, {
    align: "center",
  });
  doc.text("Signature over Printed Name", pageWidth / 2, ceoLineY + 25, {
    align: "center",
  });
  doc.text(`${formattedDate}`, pageWidth / 2, ceoLineY + 35, {
    align: "center",
  });

  // Add user signature
  const signatureWidth = 70;
  const signatureX = (pageWidth - signatureWidth) / 2;

  doc.addImage(signatureDataUrl, "PNG", signatureX, 210, signatureWidth, 30);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  const underlineY = 245;
  doc.line(signatureX, underlineY, signatureX + signatureWidth, underlineY);

  doc.text(`INTERN [${first_name} ${last_name}]`, pageWidth / 2, 260, {
    align: "center",
  });
  doc.text("Signature over Printed Name", pageWidth / 2, 270, {
    align: "center",
  });
  doc.text(`Date: ${formattedDate}`, pageWidth / 2, 280, {
    align: "center",
  });

  return doc.output("datauristring");
}