"use server";

import { Resend } from "resend";
import {
  getAcceptedTextTemplate,
  getAcceptedHtmlTemplate,
} from "../templates/accepted";
import { DEFAULT_EMAIL_CONFIG } from "../config";
import type { EmailRecipient } from "../types";

export const sendAcceptedEmail = async ({ email, name }: EmailRecipient) => {
  try {
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: DEFAULT_EMAIL_CONFIG.from,
      to: email,
      cc: DEFAULT_EMAIL_CONFIG.cc,
      replyTo: "Codebility.dev@gmail.com",
      headers: {
        "X-Priority": "1", // High priority
        "X-MSMail-Priority": "High",
        "X-Mailer": "Codebility Application System",
      },
      subject: "🎉 Congratulations! You've Been Accepted to Codebility",
      text: getAcceptedTextTemplate(name),
      html: getAcceptedHtmlTemplate(name),
    });

    if (error) {
      console.error(`Resend API error for ${name} (${email}):`, error);
      throw new Error(`Failed to send acceptance email to ${name}`);
    }
  } catch (error) {
    console.error("Error sending acceptance email:", error);
    throw new Error("Failed to send acceptance email");
  }
};

export const sendAcceptedEmailForConfig = async (email: string) => {
  const { createClientServerComponent } = await import("@/utils/supabase/server");

  try {
    const supabase = await createClientServerComponent();

    const { data: applicantData } = await supabase
      .from("codev")
      .select("first_name, last_name")
      .eq("email_address", email)
      .single();

    if (!applicantData) {
      throw new Error("Applicant not found");
    }

    await sendAcceptedEmail({
      email,
      name: `${applicantData.first_name} ${applicantData.last_name}`,
    });
  } catch (error) {
    console.error("Error sending acceptance email for config:", error);
    throw new Error("Failed to send acceptance email");
  }
};
