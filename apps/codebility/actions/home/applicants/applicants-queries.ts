"use server";

import { unstable_rethrow } from "next/navigation";

import { createClientServerComponent } from "@/lib/global/supabase-server";
import type { NewApplicantType } from "@/types/home/applicants/applicants";
import { newApplicantsSchema } from "@/utils/home/applicants/applicants";
import { requireFullAccess } from "@/lib/global/permissions";

const APPLICANT_SELECT =
  "id, first_name, last_name, email_address, phone_number, address, about, positions, display_position, portfolio_website, tech_stacks, image_url, availability_status, nda_status, level, application_status, rejected_count, facebook, linkedin, github, discord, years_of_experience, role_id, internal_status, mentor_id, nda_signature, nda_document, nda_signed_at, nda_request_sent, date_applied, applicant (*)";

async function queryApplicants(denied: boolean): Promise<NewApplicantType[]> {
  await requireFullAccess();
  try {
    const supabase = await createClientServerComponent();

    const query = supabase
      .from("codev")
      .select(APPLICANT_SELECT)
      .order("date_applied", { ascending: false });

    const { data, error } = denied
      ? await query.eq("application_status", "denied")
      : await query
          .not("application_status", "eq", "passed")
          .neq("application_status", "denied");

    if (error) {
      console.error("Error fetching new applicants:", error);
      return [];
    }

    const parsedNewApplicants = newApplicantsSchema.array().safeParse(data);

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

export async function getNewApplicants(): Promise<NewApplicantType[]> {
  return queryApplicants(false);
}

export async function getDeniedApplicants(): Promise<NewApplicantType[]> {
  return queryApplicants(true);
}

export async function getDeniedApplicantsCount(): Promise<number> {
  await requireFullAccess();
  try {
    const supabase = await createClientServerComponent();
    const { count } = await supabase
      .from("codev")
      .select("id", { count: "exact", head: true })
      .eq("application_status", "denied");

    return count ?? 0;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error counting denied applicants:", error);
    return 0;
  }
}
