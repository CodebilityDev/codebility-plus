import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobListing } from "@/app/(marketing)/careers/_types/job-listings";
import type { CareersJobListingsPage } from "@/types/marketing/careers-job-listings";
import { createClientAnon } from "@/utils/supabase/anon";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 4;
const MAX_LIMIT = 50;

const JOB_LISTINGS_SELECT =
  "id, title, department, location, type, level, description, requirements, posted_date, salary_range, remote";

export type {
  CareersJobListingsInitial,
  CareersJobListingsPage,
} from "@/types/marketing/careers-job-listings";

type JobListingRow = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobListing["type"];
  level: JobListing["level"];
  description: string;
  requirements: string[] | null;
  posted_date: string;
  salary_range: string | null;
  remote: boolean | null;
};

function parsePositiveInt(
  value: number | undefined,
  fallback: number,
  max?: number,
): number {
  if (value === undefined || !Number.isFinite(value) || value < 1) {
    return fallback;
  }
  if (max !== undefined) return Math.min(value, max);
  return value;
}

function mapRow(row: JobListingRow): JobListing {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.type,
    level: row.level,
    description: row.description,
    requirements: row.requirements ?? [],
    posted_date: row.posted_date,
    salary_range: row.salary_range ?? undefined,
    remote: row.remote ?? false,
  };
}

export async function getCareersJobDepartments(
  supabase: SupabaseClient,
): Promise<string[] | null> {
  const { data, error } = await supabase
    .from("job_listings")
    .select("department")
    .eq("status", "active");

  if (error) {
    console.error("Supabase query error (careers-job-departments):", error);
    return null;
  }

  return [
    ...new Set(
      (data ?? [])
        .map((row: { department: string | null }) => row.department)
        .filter((value): value is string => Boolean(value)),
    ),
  ].sort((a, b) => a.localeCompare(b));
}

export async function getCareersJobListingsPage(
  supabase: SupabaseClient,
  options?: {
    department?: string;
    type?: string;
    level?: string;
    page?: number;
    limit?: number;
  },
): Promise<CareersJobListingsPage | null> {
  const department = options?.department?.trim() ?? "";
  const type = options?.type?.trim() ?? "";
  const level = options?.level?.trim() ?? "";
  const page = parsePositiveInt(options?.page, DEFAULT_PAGE);
  const limit = parsePositiveInt(options?.limit, DEFAULT_LIMIT, MAX_LIMIT);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("job_listings")
    .select(JOB_LISTINGS_SELECT, { count: "exact" })
    .eq("status", "active")
    .order("posted_date", { ascending: false })
    .range(from, to);

  if (department) {
    query = query.eq("department", department);
  }
  if (type) {
    query = query.eq("type", type);
  }
  if (level) {
    query = query.eq("level", level);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Supabase query error (careers-job-listings):", error);
    return null;
  }

  const total = count ?? 0;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const rows = (data ?? []) as JobListingRow[];

  return {
    jobs: rows.map(mapRow),
    pagination: { page, limit, total, totalPages },
    department,
    type,
    level,
  };
}

export const getCachedCareersJobDepartments = unstable_cache(
  async () => getCareersJobDepartments(createClientAnon()),
  ["careers-job-departments"],
  { revalidate: 3600, tags: ["careers-job-listings"] },
);

export const getCachedCareersJobListingsPage = unstable_cache(
  async (
    department: string,
    type: string,
    level: string,
    page: number,
    limit: number,
  ) =>
    getCareersJobListingsPage(createClientAnon(), {
      department: department || undefined,
      type: type || undefined,
      level: level || undefined,
      page,
      limit,
    }),
  ["careers-job-listings-page"],
  { revalidate: 3600, tags: ["careers-job-listings"] },
);
