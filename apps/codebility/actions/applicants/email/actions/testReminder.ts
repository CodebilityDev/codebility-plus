"use server";

import { Resend } from "resend";
import { getTestReminderTextTemplate, getTestReminderHtmlTemplate } from "../templates/testReminder";
import { DEFAULT_EMAIL_CONFIG } from "../config";
import type { EmailRecipient } from "../types";

export const sendTestReminder = async ({ email, name }: EmailRecipient) => {
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
      subject: "Application Reminder - Codebility",
      text: getTestReminderTextTemplate(name),
      html: getTestReminderHtmlTemplate(name),
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error("Failed to send test reminder");
    }
  } catch (error) {
    console.error("Error sending test reminder:", error);
    throw new Error("Failed to send test reminder");
  }
};

export const sendMultipleTestReminderEmail = async (emails: string[]) => {
  try {
    const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: DEFAULT_EMAIL_CONFIG.from,
      bcc: emails,
      cc: DEFAULT_EMAIL_CONFIG.cc,
      to: DEFAULT_EMAIL_CONFIG.to,
      subject: "Application Reminder - Codebility",
      text: getTestReminderTextTemplate(),
      html: getTestReminderHtmlTemplate(),
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error("Failed to send emails");
    }
  } catch (error) {
    console.error("Error sending emails:", error);
    throw new Error("Failed to send emails");
  }
};

export const sendTestReminderWithUpdate = async ({
  email,
  name,
  applicantId,
}: EmailRecipient & { applicantId: string }) => {
  const { updateReminderCountAction } = await import("../../action");

  try {
    await sendTestReminder({ email, name });
    await updateReminderCountAction(applicantId);
  } catch (error) {
    console.error("Error sending test reminder with update:", error);
    throw new Error("Failed to send test reminder with update");
  }
};

export const sendMultipleTestReminderEmailWithUpdate = async (
  applicants: { email: string; applicantId: string }[]
) => {
  const { updateMultipleReminderCountAction } = await import("../../action");

  try {
    const emails = applicants.map((applicant) => applicant.email);
    await sendMultipleTestReminderEmail(emails);

    const applicantIds = applicants.map((applicant) => applicant.applicantId);
    await updateMultipleReminderCountAction(applicantIds);
  } catch (error) {
    console.error("Error sending multiple test reminders with update:", error);
    throw new Error("Failed to send multiple test reminders with update");
  }
};

export const sendTestReminderForConfig = async (email: string) => {
  const { createClientServerComponent } = await import("@/utils/supabase/server");
  const { updateReminderCountAction } = await import("../../action");

  try {
    const supabase = await createClientServerComponent();

    const { data: applicantData, error: queryError } = await supabase
      .from("codev")
      .select("id, first_name, last_name")
      .eq("email_address", email)
      .single();

    if (queryError) {
      console.error("Error querying applicant data:", queryError);
      throw new Error(`Failed to query applicant data: ${queryError.message}`);
    }

    if (!applicantData) {
      console.error("Applicant not found for email:", email);
      throw new Error("Applicant not found");
    }

    await sendTestReminder({
      email,
      name: `${applicantData.first_name} ${applicantData.last_name}`,
    });

    await updateReminderCountAction(applicantData.id);
  } catch (error) {
    console.error("Error sending test reminder for config:", error);
    throw new Error("Failed to send test reminder");
  }
};
