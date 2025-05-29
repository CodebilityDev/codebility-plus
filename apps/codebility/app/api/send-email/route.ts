import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { Resend } from "resend";

// Try a different import approach
import { NdaEmailTemplate } from "../../emails/nda-template";

// Or alternatively:
// const { NdaEmailTemplate } = require("../../emails/nda-template");

// Define a type for the email request
interface EmailRequest {
  recipient: string;
  subject: string;
  content: string;
  firstName?: string;
  ndaLink?: string;
  isNdaEmail?: boolean;
}


export async function POST(request: Request) {
  try {
    // Initialize Resend with your API key
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    // Parse and type the request body
    const { recipient, subject, content, firstName, ndaLink, isNdaEmail } =
      (await request.json()) as EmailRequest;

    // Log the email details
/*     console.log("Email request received:");
    console.log("To:", recipient);
    console.log("Subject:", subject); */

    let html = content;

    // If it's an NDA email, use the React Email template
    if (isNdaEmail && firstName && ndaLink) {
      // Fix: Use a function call instead of JSX
      html = await render(NdaEmailTemplate({ firstName, ndaLink }));
    }

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: "Codebility Plus <marco@codebility.tech>", // You can change this to your verified domain later
      to: [recipient],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Email sent to ${recipient}`,
      id: data?.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    // Properly type the error
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error in email service:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
