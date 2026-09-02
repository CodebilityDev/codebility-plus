"use server";

import { Resend } from "resend";
import { getDenyTextTemplate, getDenyHtmlTemplate } from "../templates/deny";
import { DEFAULT_EMAIL_CONFIG } from "../config";
import type { EmailRecipient } from "../types";

export const sendDenyEmail = async ({ email, name }: EmailRecipient) => {
  try {
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: DEFAULT_EMAIL_CONFIG.from,
      to: email,
      cc: DEFAULT_EMAIL_CONFIG.cc,
      replyTo: "Codebility.dev@gmail.com",
      headers: {
        "X-Priority": "3",
        "X-MSMail-Priority": "Normal",
        "X-Mailer": "Codebility Application System",
      },
      subject: "Application Status - Codebility",
      text: getDenyTextTemplate(name),
      html: getDenyHtmlTemplate(name),
    });

    if (error) {
      console.error(`Resend API error for ${name} (${email}):`, error);
      throw new Error(`Failed to send email to ${name}`);
    }
  } catch (error) {
    console.error("Error sending deny email:", error);
    throw new Error("Failed to send deny email");
  }
};

export const sendMultipleDenyEmail = async (
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
        subject: "Application Status - Codebility",
        text: getDenyTextTemplate(name),
        html: getDenyHtmlTemplate(name),
      });

      if (error) {
        console.error(`Resend API error for ${name} (${email}):`, error);
        throw new Error(`Failed to send email to ${name}`);
      }
    }
  } catch (error) {
    console.error("Error sending multiple deny emails:", error);
    throw new Error("Failed to send multiple deny emails");
  }
};

export const sendDenyEmailForConfig = async (email: string) => {
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

    await sendDenyEmail({
      email,
      name: `${applicantData.first_name} ${applicantData.last_name}`,
    });
  } catch (error) {
    console.error("Error sending deny email for config:", error);
    throw new Error("Failed to send deny email");
  }
};
