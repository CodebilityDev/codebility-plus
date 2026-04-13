// app/api/appointments/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // ✅ fixes Edge Runtime incompatibility

// Use service role key directly — bypasses RLS for server-side inserts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.DB_SERVICE_ROLE!
);

// ─── Request body type ─────────────────────────────────────────────────────

interface AppointmentBody {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  industry: string;
  serviceInterest: string;
  projectType: string;
  featuresNeeded: string;
  referralSource: string;
  interestLevel: number;
  otherRequirements: string;
  appointmentDate: string;
  appointmentTime: string;
  meetingType: string;
  meetingToolOther: string | null;
}

// ─── POST handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AppointmentBody;

    const {
      firstName, lastName, email, companyName, phoneNumber, industry,
      serviceInterest, projectType, featuresNeeded,
      referralSource, interestLevel, otherRequirements,
      appointmentDate, appointmentTime, meetingType, meetingToolOther,
    } = body;

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        company_name: companyName,
        phone_number: phoneNumber,
        industry,
        service_interest: serviceInterest,
        project_type: projectType,
        features_needed: featuresNeeded,
        referral_source: referralSource,
        interest_level: interestLevel,
        other_requirements: otherRequirements,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        meeting_type: meetingType,
        meeting_tool_other: meetingToolOther || null,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("[appointments] Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save appointment." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("[appointments] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}