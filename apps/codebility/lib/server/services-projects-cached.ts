import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClientAnon } from "@/utils/supabase/anon";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

const CATEGORY_ID_BY_SLUG: Record<string, number> = {
  "web-application": 1,
  "mobile-application": 2,
  "product-design": 3,
  "ai-development": 4,
  cms: 5,
};

const LIST_SELECT = `
  id,
  name,
  main_image,
  description,
  website_url,
  categories:project_categories(
    projects_category(id, name)
  )
`;

const LIST_SELECT_CATEGORY = `
  id,
  name,
  main_image,
  description,
  website_url,
  categories:project_categories!inner(
    category_id,
    projects_category(id, name)
  )
`;

const DETAIL_SELECT = `
  id,
  name,
  description,
  tagline,
  key_features,
  main_image,
  github_link,
  figma_link,
  start_date,
  end_date,
  website_url,
  tech_stack,
  project_members (
    id,
    codev_id,
    role,
    joined_at
  ),
  categories:project_categories(
    projects_category(id, name)
  )
`;

export type ServicesProjectCard = {
  id: string;
  name: string;
  main_image?: string;
  description?: string;
  website_url?: string;
  categories: Array<{ id: number; name: string }>;
};

export type ServicesProjectMember = {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
  role?: string;
};

export type ServicesProjectDetail = ServicesProjectCard & {
  tagline?: string;
  key_features?: string[];
  github_link?: string;
  figma_link?: string;
  start_date?: string;
  end_date?: string;
  tech_stack?: string[];
  members: ServicesProjectMember[];
};

export type ServicesProjectsPage = {
  projects: ServicesProjectCard[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  category: string;
};

type ListRow = {
  id: string;
  name: string;
  main_image: string | null;
  description: string | null;
  website_url: string | null;
  categories?: Array<{
    category_id?: number;
    projects_category?: { id: number; name: string } | null;
  }> | null;
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

function mapCategories(
  rows?: ListRow["categories"],
): Array<{ id: number; name: string }> {
  if (!rows) return [];
  const categories: Array<{ id: number; name: string }> = [];
  for (const row of rows) {
    const category = row.projects_category;
    if (!category) continue;
    categories.push({ id: category.id, name: category.name });
  }
  return categories;
}

function mapCard(row: ListRow): ServicesProjectCard {
  return {
    id: row.id,
    name: row.name,
    main_image: row.main_image ?? undefined,
    description: row.description ?? undefined,
    website_url: row.website_url ?? undefined,
    categories: mapCategories(row.categories),
  };
}

export async function getServicesProjectsPage(
  supabase: SupabaseClient,
  options?: {
    category?: string;
    page?: number;
    limit?: number;
  },
): Promise<ServicesProjectsPage | null> {
  const category = options?.category ?? "all";
  const page = parsePositiveInt(options?.page, DEFAULT_PAGE);
  const limit = parsePositiveInt(options?.limit, DEFAULT_LIMIT, MAX_LIMIT);
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const categoryId =
    category === "all" ? null : (CATEGORY_ID_BY_SLUG[category] ?? null);

  let query = supabase
    .from("projects")
    .select(categoryId === null ? LIST_SELECT : LIST_SELECT_CATEGORY, {
      count: "exact",
    })
    .eq("public_display", true)
    .order("id", { ascending: true })
    .range(from, to);

  if (categoryId !== null) {
    query = query.eq("categories.category_id", categoryId);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Supabase query error (services-projects):", error);
    return null;
  }

  const total = count ?? 0;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const rows = (data ?? []) as unknown as ListRow[];

  return {
    projects: rows.map(mapCard),
    pagination: { page, limit, total, totalPages },
    category,
  };
}

export async function getServicesProjectById(
  supabase: SupabaseClient,
  projectId: string,
): Promise<ServicesProjectDetail | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(DETAIL_SELECT)
    .eq("id", projectId)
    .eq("public_display", true)
    .maybeSingle();

  if (error) {
    console.error("Supabase query error (services-project detail):", error);
    return null;
  }
  if (!data) return null;

  const row = data as unknown as ListRow & {
    tagline?: string | null;
    key_features?: string[] | null;
    github_link?: string | null;
    figma_link?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    tech_stack?: string[] | null;
    project_members?: Array<{
      codev_id: string;
      role: string;
    }> | null;
  };

  const codevIds = [
    ...new Set(
      (row.project_members ?? [])
        .map((member) => member.codev_id)
        .filter(Boolean),
    ),
  ];

  const codevMap = new Map<
    string,
    {
      id: string;
      first_name: string;
      last_name: string;
      image_url?: string | null;
    }
  >();

  if (codevIds.length > 0) {
    const { data: codevs, error: codevError } = await supabase
      .from("codev")
      .select("id, first_name, last_name, image_url")
      .in("id", codevIds);

    if (codevError) {
      console.error(
        "Error fetching codev records for services-project detail:",
        codevError,
      );
    } else {
      for (const codev of codevs ?? []) {
        codevMap.set(codev.id, codev);
      }
    }
  }

  const members: ServicesProjectMember[] = [];
  for (const member of row.project_members ?? []) {
    const codev = codevMap.get(member.codev_id);
    if (!codev) continue;
    members.push({
      id: codev.id,
      first_name: codev.first_name,
      last_name: codev.last_name,
      image_url: codev.image_url,
      role: member.role,
    });
  }

  return {
    ...mapCard(row),
    tagline: row.tagline ?? undefined,
    key_features: row.key_features ?? [],
    github_link: row.github_link ?? undefined,
    figma_link: row.figma_link ?? undefined,
    start_date: row.start_date ?? undefined,
    end_date: row.end_date ?? undefined,
    tech_stack: row.tech_stack ?? [],
    members,
  };
}

export const getCachedServicesProjectsPage = unstable_cache(
  async (category: string, page: number, limit: number) =>
    getServicesProjectsPage(createClientAnon(), { category, page, limit }),
  ["services-projects"],
  { revalidate: 3600, tags: ["services-projects"] },
);

export const getCachedServicesProjectById = unstable_cache(
  async (projectId: string) =>
    getServicesProjectById(createClientAnon(), projectId),
  ["services-project-detail"],
  { revalidate: 3600, tags: ["services-projects"] },
);
