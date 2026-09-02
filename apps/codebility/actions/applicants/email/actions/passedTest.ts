"use server";

import { Resend } from "resend";
import {
  getPassedTestTextTemplate,
  getPassedTestHtmlTemplate,
} from "../templates/passedTest";
import { DEFAULT_EMAIL_CONFIG } from "../config";
import type { EmailRecipient } from "../types";

export const sendPassedTestEmail = async ({ email, name }: EmailRecipient) => {
  try {
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
    const waitListLink = process.env.NEXT_PUBLIC_MESSENGER_WAITLIST;
    const discordLink = process.env.NEXT_PUBLIC_DISCORD_LINK;

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
      subject: "Congratulations on Passing the Assessment - Codebility",
      text: getPassedTestTextTemplate(name, waitListLink, discordLink),
      html: getPassedTestHtmlTemplate(name, waitListLink, discordLink),
    });

    if (error) {
      console.error(`Resend API error for ${name} (${email}):`, error);
      throw new Error(`Failed to send email to ${name}`);
    }
  } catch (error) {
    console.error("Error sending passed test email:", error);
    throw new Error("Failed to send passed test email");
  }
};

export const sendMultiplePassedTestEmail = async (
  Applicant: { email: string; name: string }[]
) => {
  try {
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    for (const applicant of Applicant) {
      const { email, name } = applicant;

      const waitListLink = process.env.NEXT_PUBLIC_MESSENGER_WAITLIST;
      const discordLink = process.env.NEXT_PUBLIC_DISCORD_LINK;

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
        subject: "Congratulations on Passing the Assessment - Codebility",
        text: getPassedTestTextTemplate(name, waitListLink, discordLink),
        html: getPassedTestHtmlTemplate(name, waitListLink, discordLink),
      });

      if (error) {
        console.error(`Resend API error for ${name} (${email}):`, error);
        throw new Error(`Failed to send email to ${name}`);
      }
    }
  } catch (error) {
    console.error("Error sending multiple passed test emails:", error);
    throw new Error("Failed to send multiple passed test emails");
  }
};

export const sendPassedTestEmailForConfig = async (email: string) => {
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

    await sendPassedTestEmail({
      email,
      name: `${applicantData.first_name} ${applicantData.last_name}`,
    });
  } catch (error) {
    console.error("Error sending passed test email for config:", error);
    throw new Error("Failed to send passed test email");
  }
};
