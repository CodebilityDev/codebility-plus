"use server";

import { unstable_rethrow } from "next/navigation";

import { createClientServerComponent } from "@/lib/global/supabase-server";
import type { NewApplicantType } from "@/types/home/applicants/applicants";
import { newApplicantsSchema } from "@/utils/home/applicants/applicants";

export async function getNewApplicants(): Promise<NewApplicantType[]> {
  try {
    const supabase = await createClientServerComponent();

    const { data: newApplicants, error } = await supabase
      .from("codev")
      .select(
        "id, first_name, last_name, email_address, phone_number, address, about, positions, display_position, portfolio_website, tech_stacks, image_url, availability_status, nda_status, level, application_status, rejected_count, facebook, linkedin, github, discord, years_of_experience, role_id, internal_status, mentor_id, nda_signature, nda_document, nda_signed_at, nda_request_sent, date_applied, applicant (*)",
      )
      .not("application_status", "eq", "passed")
      .order("date_applied", { ascending: false });

    if (error) {
      console.error("Error fetching new applicants:", error);
      return [];
    }

    const parsedNewApplicants = newApplicantsSchema.array().safeParse(newApplicants);

    if (parsedNewApplicants.error) {
      console.error("Error parsing new applicants:", parsedNewApplicants.error);
      return [];
    }

    return parsedNewApplicants.data;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error fetching new applicants:", error);
    return [];
  }
}