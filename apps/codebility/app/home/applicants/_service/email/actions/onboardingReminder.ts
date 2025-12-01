"use server";

import { Resend } from "resend";
import {
  getOnboardingReminderTextTemplate,
  getOnboardingReminderHtmlTemplate,
} from "../templates/onboardingReminder";
import { DEFAULT_EMAIL_CONFIG } from "../config";
import type { EmailRecipient } from "../types";

export const sendOnboardingReminder = async ({ email, name }: EmailRecipient) => {
  try {
    const waitListLink = process.env.NEXT_PUBLIC_MESSENGER_WAITLIST;
    const discordLink = process.env.NEXT_PUBLIC_DISCORD_LINK;
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
      subject: "Onboarding Reminder - Codebility",
      text: getOnboardingReminderTextTemplate(name, waitListLink, discordLink),
      html: getOnboardingReminderHtmlTemplate(name, waitListLink, discordLink),
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error("Failed to send onboarding reminder");
    }
  } catch (error) {
    console.error("Error sending onboarding reminder email:", error);
    throw new Error("Failed to send onboarding reminder email");
  }
};

export const sendMultipleOnboardingReminder = async (emails: string[]) => {
  try {
    const waitListLink = process.env.NEXT_PUBLIC_MESSENGER_WAITLIST;
    const discordLink = process.env.NEXT_PUBLIC_DISCORD_LINK;
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: DEFAULT_EMAIL_CONFIG.from,
      bcc: emails,
      cc: DEFAULT_EMAIL_CONFIG.cc,
      to: DEFAULT_EMAIL_CONFIG.to,
      replyTo: "Codebility.dev@gmail.com",
      headers: {
        "X-Priority": "3",
        "X-MSMail-Priority": "Normal",
        "X-Mailer": "Codebility Application System",
      },
      subject: "Onboarding Reminder - Codebility",
      text: getOnboardingReminderTextTemplate(undefined, waitListLink, discordLink),
      html: getOnboardingReminderHtmlTemplate(undefined, waitListLink, discordLink),
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error("Failed to send onboarding reminder emails");
    }
  } catch (error) {
    console.error("Error sending onboarding reminder emails:", error);
    throw new Error("Failed to send onboarding reminder emails");
  }
};

export const sendOnboardingReminderWithUpdate = async ({
  email,
  name,
  applicantId,
}: EmailRecipient & { applicantId: string }) => {
  const { updateReminderCountAction } = await import("../../action");

  try {
    await sendOnboardingReminder({ email, name });
    await updateReminderCountAction(applicantId);
  } catch (error) {
    console.error("Error sending onboarding reminder with update:", error);
    throw new Error("Failed to send onboarding reminder with update");
  }
};

export const sendMultipleOnboardingReminderWithUpdate = async (
  applicants: { email: string; applicantId: string }[]
) => {
  const { updateMultipleReminderCountAction } = await import("../../action");

  try {
    const emails = applicants.map((applicant) => applicant.email);
    await sendMultipleOnboardingReminder(emails);

    const applicantIds = applicants.map((applicant) => applicant.applicantId);
    await updateMultipleReminderCountAction(applicantIds);
  } catch (error) {
    console.error("Error sending multiple onboarding reminders with update:", error);
    throw new Error("Failed to send multiple onboarding reminders with update");
  }
};

export const sendOnboardingReminderForConfig = async (email: string) => {
  const { createClientServerComponent } = await import("@/utils/supabase/server");
  const { updateReminderCountAction } = await import("../../action");

  try {
    const supabase = await createClientServerComponent();

    const { data: applicantData } = await supabase
      .from("codev")
      .select("id, first_name, last_name")
      .eq("email_address", email)
      .single();

    if (!applicantData) {
      throw new Error("Applicant not found");
    }

    await sendOnboardingReminder({
      email,
      name: `${applicantData.first_name} ${applicantData.last_name}`,
    });

    await updateReminderCountAction(applicantData.id);
  } catch (error) {
    console.error("Error sending onboarding reminder for config:", error);
    throw new Error("Failed to send onboarding reminder");
  }
};
