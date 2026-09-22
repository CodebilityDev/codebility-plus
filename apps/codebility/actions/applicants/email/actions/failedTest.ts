"use server";

import { Resend } from "resend";
import {
  getFailedTestTextTemplate,
  getFailedTestHtmlTemplate,
} from "../templates/failedTest";
import { DEFAULT_EMAIL_CONFIG } from "../config";
import type { EmailRecipient } from "../types";

export const sendFailedTestEmail = async ({ email, name }: EmailRecipient) => {
  try {
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: DEFAULT_EMAIL_CONFIG.from,
      to: email,
      replyTo: "Codebility.dev@gmail.com",
      cc: DEFAULT_EMAIL_CONFIG.cc,
      headers: {
        "X-Priority": "3",
        "X-MSMail-Priority": "Normal",
        "X-Mailer": "Codebility Application System",
      },
      subject: "Test Result - Codebility",
      text: getFailedTestTextTemplate(name),
      html: getFailedTestHtmlTemplate(name),
    });

    if (error) {
      console.error(`Resend API error for ${name} (${email}):`, error);
      throw new Error(`Failed to send email to ${name}`);
    }
  } catch (error) {
    console.error("Error sending failed test email:", error);
    throw new Error("Failed to send failed test email");
  }
};

export const sendMultipleFailedTestEmail = async (
  Applicant: { email: string; name: string }[]
) => {
  try {
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    for (const applicant of Applicant) {
      const { email, name } = applicant;

      const { data, error } = await resend.emails.send({
        from: DEFAULT_EMAIL_CONFIG.from,
        to: email,
        replyTo: "Codebility.dev@gmail.com",
        cc: DEFAULT_EMAIL_CONFIG.cc,
        headers: {
          "X-Priority": "3",
          "X-MSMail-Priority": "Normal",
          "X-Mailer": "Codebility Application System",
        },
        subject: "Test Result - Codebility",
        text: getFailedTestTextTemplate(name),
        html: getFailedTestHtmlTemplate(name),
      });

      if (error) {
        console.error(`Resend API error for ${name} (${email}):`, error);
        throw new Error(`Failed to send email to ${name}`);
      }
    }
  } catch (error) {
    console.error("Error sending multiple failed test emails:", error);
    throw new Error("Failed to send multiple failed test emails");
  }
};

export const sendFailedTestEmailForConfig = async (email: string) => {
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

    await sendFailedTestEmail({
      email,
      name: `${applicantData.first_name} ${applicantData.last_name}`,
    });
  } catch (error) {
    console.error("Error sending failed test email for config:", error);
    throw new Error("Failed to send failed test email");
  }
};
