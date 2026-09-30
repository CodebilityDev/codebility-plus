"use server";

import { createClient } from "@supabase/supabase-js";

import type { AppointmentBody } from "@/types/marketing/contact/contact-appointment";

export async function createAppointment(body: AppointmentBody) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.DB_SERVICE_ROLE;

  if (!supabaseUrl || !supabaseKey) {
    console.error("[appointments] Missing Supabase environment variables.");
    return { error: "Server misconfiguration." };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      company_name: body.companyName,
      phone_number: body.phoneNumber,
      industry: body.industry,
      service_interest: body.serviceInterest,
      project_type: body.projectType,
      features_needed: body.featuresNeeded,
      referral_source: body.referralSource,
      interest_level: body.interestLevel,
      other_requirements: body.otherRequirements,
      appointment_date: body.appointmentDate,
      appointment_time: body.appointmentTime,
      meeting_type: body.meetingType,
      meeting_tool_other: body.meetingToolOther ?? null,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("[appointments] Supabase insert error:", error);
    return { error: "Failed to save appointment." };
  }

  return { success: true, id: data.id };
}