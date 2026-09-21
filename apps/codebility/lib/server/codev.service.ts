import "server-only";

import { cache } from "react";
import { Client, Codev, Project, WorkExperience } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";
import { resolvePageArgs, toPage, type Page, type PageArgs } from "./paginate";

// Exactly the fields the in-house table renders plus the two the filter bar
// matches on. Adding a column here costs every row on every page load; the
// heavy relations live in getCodevDetail instead. The interns card grid needs
// more than this and uses CODEV_CARD_COLUMNS below.
export const CODEV_LIST_COLUMNS =
  "id, first_name, last_name, email_address, image_url, role_id, display_position, internal_status, availability_status, positions, nda_status, date_joined";

export type CodevListRow = Pick<
  Codev,
  | "id"
  | "first_name"
  | "last_name"
  | "email_address"
  | "image_url"
  | "role_id"
  | "display_position"
  | "internal_status"
  | "availability_status"
  | "positions"
  | "nda_status"
  | "date_joined"
>;

export type CodevListFilters = {
  application_status?: string;
  internal_status?: string;
  display_position?: string;
  availability_status?: boolean;
  nda_status?: boolean;
  position?: string;
  role_id?: number | string;
  search?: string;
};

export const getCodevsPage = async ({
  page,
  pageSize,
  filters = {},
}: PageArgs & { filters?: CodevListFilters } = {}): Promise<Page<CodevListRow>> => {
  const supabase = await createClientServerComponent();
  const { page: current, pageSize: size, from, to } = resolvePageArgs({ page, pageSize });

  let query = supabase
    .from("codev")
    .select(CODEV_LIST_COLUMNS, { count: "exact" });

  if (filters.application_status)
    query = query.eq("application_status", filters.application_status);
  if (filters.internal_status)
    query = query.eq("internal_status", filters.internal_status);
  if (filters.display_position)
    query = query.eq("display_position", filters.display_position);
  if (filters.availability_status !== undefined)
    query = query.eq("availability_status", filters.availability_status);
  if (filters.nda_status !== undefined)
    query = query.eq("nda_status", filters.nda_status);
  if (filters.position) query = query.contains("positions", [filters.position]);
  if (filters.role_id !== undefined) query = query.eq("role_id", filters.role_id);
  if (filters.search) {
    const term = `%${filters.search}%`;
    query = query.or(
      `first_name.ilike.${term},last_name.ilike.${term},email_address.ilike.${term},display_position.ilike.${term}`,
    );
  }

  const { data, error, count } = await query
    .order("date_joined", { ascending: false, nullsFirst: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching codev page:", error);
    return toPage<CodevListRow>(null, 0, current, size);
  }

  return toPage((data ?? []) as CodevListRow[], count, current, size);
};

// The interns card grid renders avatars, badges (level), skill points
// (codev_points), tech stacks and project names, so it needs these relations.
// Ordering comes from the database's landing_rank_score column, which is kept
// current by triggers (supabase/migrations/20260825_landing_interns_rank_score.sql),
// so the multi-key priority sort no longer has to run in the client.
export const CODEV_CARD_COLUMNS = `
  id,
  first_name,
  last_name,
  display_position,
  image_url,
  role_id,
  level,
  tech_stacks,
  years_of_experience,
  application_status,
  availability_status,
  codev_points ( id, skill_category_id, points ),
  project_members ( project: projects ( id, name ) )
`;

export type CodevCardRow = Pick<
  Codev,
  | "id"
  | "first_name"
  | "last_name"
  | "display_position"
  | "image_url"
  | "role_id"
  | "level"
  | "tech_stacks"
  | "years_of_experience"
  | "application_status"
  | "availability_status"
  | "codev_points"
  | "projects"
>;

export const getInternsPage = async ({
  page,
  pageSize,
  filters = {},
}: PageArgs & { filters?: CodevListFilters } = {}): Promise<Page<CodevCardRow>> => {
  const supabase = await createClientServerComponent();
  const { page: current, pageSize: size, from, to } = resolvePageArgs({ page, pageSize });

  let query = supabase
    .from("codev")
    .select(CODEV_CARD_COLUMNS, { count: "exact" })
    .eq("application_status", "passed");

  if (filters.display_position)
    query = query.eq("display_position", filters.display_position);
  if (filters.internal_status)
    query = query.eq("internal_status", filters.internal_status);
  if (filters.availability_status !== undefined)
    query = query.eq("availability_status", filters.availability_status);
  if (filters.search) {
    const term = `%${filters.search}%`;
    query = query.or(
      `first_name.ilike.${term},last_name.ilike.${term},display_position.ilike.${term}`,
    );
  }

  const { data, error, count } = await query
    .order("landing_rank_score", { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching interns page:", error);
    return toPage<CodevCardRow>(null, 0, current, size);
  }

  const rows = ((data ?? []) as any[]).map((row) => ({
    ...row,
    codev_points: row.codev_points ?? [],
    projects: (row.project_members ?? [])
      .map((member: any) => member.project)
      .filter(Boolean),
  })) as CodevCardRow[];

  return toPage(rows, count, current, size);
};

export const getCodevStatusCounts = async (
  filters: CodevListFilters = {},
): Promise<{ total: number; active: number; inactive: number }> => {
  const supabase = await createClientServerComponent();

  const base = () => {
    let query = supabase
      .from("codev")
      .select("id", { count: "exact", head: true });
    if (filters.application_status)
      query = query.eq("application_status", filters.application_status);
    return query;
  };

  const [total, active] = await Promise.all([
    base(),
    base().eq("availability_status", true),
  ]);

  const totalCount = total.count ?? 0;
  const activeCount = active.count ?? 0;

  return { total: totalCount, active: activeCount, inactive: totalCount - activeCount };
};

export const getCodevDetail = cache(
  async (id: string): Promise<Codev | null> => {
    const { data, error } = await getCodevs({ filters: { id } });
    if (error) return null;
    return data?.[0] ?? null;
  },
);

export const getCodevs = async ({
  filters = {},
}: {
  filters?: {
    id?: string;
    role_id?: number | string;
    application_status?: string;
  };
} = {}): Promise<{ error: any; data: Codev[] | null }> => {
   const supabase = await createClientServerComponent();
  let query = supabase.from("codev").select(`
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
    internal_status,
    role_id,
    mentor_id,
    created_at,
    updated_at,
    date_joined,
    education (
      id,
      institution,
      degree,
      start_date,
      end_date,
      description,
      created_at,
      updated_at
    ),
    work_experience (
      id,
      position,
      description,
      date_from,
      date_to,
      company_name,
      location,
      is_present,
      profile_id
    ),
    work_schedules (
      id,
      days_of_week,
      start_time,
      end_time,
      created_at,
      updated_at
    ),
    project_members (
      role,
      joined_at,
      project: projects (
        id,
        name,
        description,
        status,
        start_date,
        end_date,
        github_link,
        main_image,
        website_url,
        figma_link,
        client_id,
        categories:project_categories(
          projects_category(
            id,
            name,
            description
          )
        ),
        created_at,
        updated_at,
        project_members (
          role,
          joined_at,
          codev: codev_id (
            id,
            first_name,
            last_name,
            image_url
          )
        )
      )
    ),
    codev_points (
      id,
      skill_category_id,
      points
    ),
    headline
  `);

  // Apply filters dynamically
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      query = query.eq(key, value);
    }
  });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Codev data:", error);
    return { error, data: null };
  }

  // Transform the data to match the Codev interface
  const normalizedData = data.map((codev: any) => ({
    ...codev,
    education: codev.education || [],
    work_experience: (codev.work_experience || []).map((exp: any) => ({
      ...exp,
      codev_id: codev.id,
    })) as WorkExperience[],
    work_schedules: codev.work_schedules || [],
    projects: (codev.project_members || []).map(
      (member: any) =>
        ({
          ...member.project,
          role: member.role,
          joined_at: member.joined_at,
          project_members: member.project?.project_members || [],
          // Flatten categories from nested structure
          categories: (member.project?.categories || []).map(
            (cat: any) => cat.projects_category
          ).filter(Boolean),
        }) as Project & { role: string; joined_at: string },
    ),
  })) as unknown as Codev[];

  return { error: null, data: normalizedData };
};

export const getClients = async (): Promise<{
  error: any;
  data: Client[] | null;
}> => {
   const supabase = await createClientServerComponent();
  const { data, error } = await supabase.from("clients").select(`
    id,
    name,
    email,
    phone_number,
    industry,
    company_logo,
    website,
    status,
    client_type,
    country,
    address,
    created_at,
    updated_at
  `);

  return { error, data: data || null };
};
