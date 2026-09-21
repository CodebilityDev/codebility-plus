"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { newApplicantsSchema, NewApplicantType } from "@/types/applicants";
import { resolvePageArgs, toPage, type Page, type PageArgs } from "@/lib/server/paginate";

// Every codev field newApplicantsSchema requires, plus the applicant relation it
// requires and the table renders. The schema (types/applicants.ts) parses each
// row, so a column missing here fails the whole page, not just one cell.
const APPLICANT_LIST_COLUMNS = `
  id,
  first_name,
  last_name,
  email_address,
  phone_number,
  address,
  about,
  positions,
  display_position,
  portfolio_website,
  tech_stacks,
  image_url,
  availability_status,
  nda_status,
  level,
  application_status,
  rejected_count,
  facebook,
  linkedin,
  github,
  discord,
  years_of_experience,
  role_id,
  internal_status,
  mentor_id,
  nda_signature,
  nda_document,
  nda_signed_at,
  nda_request_sent,
  date_applied,
  created_at,
  updated_at,
  applicant (
    id,
    codev_id,
    test_taken,
    fork_url,
    reminded_count,
    last_reminded_date,
    quiz_score,
    quiz_total,
    quiz_passed,
    quiz_completed_at,
    can_do_mobile,
    commitment_signed_at,
    signature_data,
    created_at,
    updated_at
  )
`;

export async function getNewApplicants(): Promise<NewApplicantType[]> {
  try {
    const supabase = await createClientServerComponent();

    const { data: newApplicants, error } = await supabase
      .from("codev")
      .select(`*,
                applicant (*)
                `)
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
    console.error("Error fetching new applicants:", error);
    return [];
  }
}

/**
 * One page of applicants for a single pipeline tab. `status` is the tab's
 * application_status, so the tab counts and the page come from the database
 * rather than from filtering the whole table in the browser.
 */
export const getApplicantsPage = async ({
  status,
  search,
  page,
  pageSize,
}: PageArgs & { status?: string; search?: string } = {}): Promise<Page<NewApplicantType>> => {
  const supabase = await createClientServerComponent();
  const { page: current, pageSize: size, from, to } = resolvePageArgs({ page, pageSize });

  let query = supabase
    .from("codev")
    .select(APPLICANT_LIST_COLUMNS, { count: "exact" })
    .not("application_status", "eq", "passed");

  if (status) query = query.eq("application_status", status);
  if (search) {
    const term = `%${search}%`;
    query = query.or(
      `first_name.ilike.${term},last_name.ilike.${term},email_address.ilike.${term}`,
    );
  }

  const { data, error, count } = await query
    .order("date_applied", { ascending: false, nullsFirst: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching applicants page:", error);
    return toPage<NewApplicantType>(null, 0, current, size);
  }

  const parsed = newApplicantsSchema.array().safeParse(data);
  if (parsed.error) {
    console.error("Error parsing applicants page:", parsed.error);
    return toPage<NewApplicantType>(null, 0, current, size);
  }

  return toPage(parsed.data, count, current, size);
};

/** Per-status totals for the tab badges, counted in the database. */export const getApplicantStatusCounts = async (): Promise<Record<string, number>> => {
  const supabase = await createClientServerComponent();
  const statuses = ["applying", "testing", "onboarding", "waitlist", "denied"];

  const results = await Promise.all(
    statuses.map((status) =>
      supabase
        .from("codev")
        .select("id", { count: "exact", head: true })
        .eq("application_status", status),
    ),
  );

  return Object.fromEntries(
    statuses.map((status, i) => [status, results[i]?.count ?? 0]),
  );
};

/** Client-facing alias for the table's page changes (F1: interaction-driven). */
export const getApplicantsPageAction = getApplicantsPage;
