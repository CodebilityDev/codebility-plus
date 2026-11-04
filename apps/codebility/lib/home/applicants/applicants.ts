import { unstable_rethrow } from "next/navigation";

import { createClientServerComponent } from "@/lib/global/supabase-server";
import { logPerf } from "@/lib/global/timing";
import { APPLICANT_STATUSES } from "@/constants/home/applicants/statuses";
import type {
  ApplicantCounts,
  ApplicantStatus,
  NewApplicantType,
} from "@/types/home/applicants/applicants";
import { newApplicantsSchema } from "@/utils/home/applicants/applicants";

const APPLICANT_SELECT =
  "id, first_name, last_name, email_address, phone_number, address, about, positions, display_position, portfolio_website, tech_stacks, image_url, availability_status, nda_status, level, application_status, rejected_count, facebook, linkedin, github, discord, years_of_experience, role_id, internal_status, mentor_id, nda_signature, nda_document, nda_signed_at, nda_request_sent, date_applied, applicant (*)";


export async function getApplicantsByStatus(
  status: ApplicantStatus,
): Promise<NewApplicantType[]> {
  try {
    const supabase = await createClientServerComponent();

    const queryStartedAt = performance.now();
    const { data, error } = await supabase
      .from("codev")
      .select(APPLICANT_SELECT)
      .eq("application_status", status)
      .order("date_applied", { ascending: false });
    logPerf(`applicants.${status}`, queryStartedAt);

    if (error) {
      console.error("Error fetching applicants:", error);
      return [];
    }

    const parsedNewApplicants = newApplicantsSchema.array().safeParse(data);

    if (parsedNewApplicants.error) {
      console.error("Error parsing applicants:", parsedNewApplicants.error);
      return [];
    }

    return parsedNewApplicants.data;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error fetching applicants:", error);
    return [];
  }
}

export async function getApplicantCounts(): Promise<ApplicantCounts> {
  try {
    const supabase = await createClientServerComponent();

    const countsStartedAt = performance.now();
    const entries = await Promise.all(
      APPLICANT_STATUSES.map(async (status) => {
        const { count } = await supabase
          .from("codev")
          .select("id", { count: "exact", head: true })
          .eq("application_status", status);

        return [status, count ?? 0] as const;
      }),
    );
    logPerf("applicants.counts", countsStartedAt);

    return Object.fromEntries(entries) as ApplicantCounts;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error counting applicants:", error);
    return { applying: 0, testing: 0, onboarding: 0, waitlist: 0, denied: 0 };
  }
}
