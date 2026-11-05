import { cacheLife, cacheTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";

import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { createClientAnon } from "@/lib/global/supabase-anon";
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
  "id, first_name, last_name, email_address, phone_number, address, about, display_position, portfolio_website, tech_stacks, image_url, availability_status, application_status, facebook, linkedin, github, discord, years_of_experience, date_applied, applicant (test_taken, fork_url, reminded_count, last_reminded_date, quiz_score, quiz_total, quiz_passed, quiz_completed_at, can_do_mobile, commitment_signed_at)";


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
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.applicants);

  try {
    const supabase = createClientAnon();

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
export async function getApplicantsPage({
  status,
  page,
  pageSize,
  search,
}: {
  status: ApplicantStatus;
  page: number;
  pageSize: number;
  search?: string;
}): Promise<{ applicants: NewApplicantType[]; total: number }> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.applicants);

  try {
    const supabase = createClientAnon();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const queryStartedAt = performance.now();
    let query = supabase
      .from("codev")
      .select(APPLICANT_SELECT, { count: "exact" })
      .eq("application_status", status);

    const term = search?.trim().replace(/[%,()]/g, "");
    if (term) {
      query = query.or(
        `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email_address.ilike.%${term}%`,
      );
    }

    const { data, error, count } = await query
      .order("date_applied", { ascending: false })
      .range(from, to);
    logPerf(`applicants.${status}.page`, queryStartedAt);

    if (error) {
      console.error("Error fetching applicants:", error);
      return { applicants: [], total: 0 };
    }

    const parsedNewApplicants = newApplicantsSchema.array().safeParse(data);

    if (parsedNewApplicants.error) {
      console.error("Error parsing applicants:", parsedNewApplicants.error);
      return { applicants: [], total: 0 };
    }

    return { applicants: parsedNewApplicants.data, total: count ?? 0 };
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error fetching applicants:", error);
    return { applicants: [], total: 0 };
  }
}
