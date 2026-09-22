import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Codev, WorkExperience } from "@/types/home/codev";
import { createClientAnon } from "@/utils/supabase/anon";

const PROFILE_DETAIL_SELECT = `
  id,
  first_name,
  last_name,
  image_url,
  display_position,
  portfolio_website,
  about,
  github,
  linkedin,
  tech_stacks,
  availability_status,
  nda_status,
  level,
  headline,
  education (
    id,
    institution,
    degree,
    start_date,
    end_date,
    description
  ),
  work_experience (
    id,
    position,
    description,
    date_from,
    date_to,
    company_name,
    location,
    is_present
  ),
  work_schedules (
    id,
    days_of_week,
    start_time,
    end_time
  ),
  codev_points (
    id,
    skill_category_id,
    points
  )
`;

const PROFILE_META_SELECT =
  "id, first_name, last_name, image_url";

export type ProfileDetailMeta = {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string;
};

type ProfileDetailRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  display_position: string | null;
  portfolio_website: string | null;
  about: string | null;
  github: string | null;
  linkedin: string | null;
  tech_stacks: string[] | null;
  availability_status: boolean | null;
  nda_status: boolean | null;
  level: Record<string, number> | null;
  headline: string | null;
  education: Codev["education"];
  work_experience: WorkExperience[] | null;
  work_schedules: Codev["work_schedules"];
  codev_points: Codev["codev_points"];
};

function mapProfileDetail(row: ProfileDetailRow): Codev {
  return {
    id: row.id,
    first_name: row.first_name ?? "",
    last_name: row.last_name ?? "",
    image_url: row.image_url ?? undefined,
    display_position: row.display_position ?? undefined,
    portfolio_website: row.portfolio_website ?? undefined,
    about: row.about ?? undefined,
    github: row.github ?? undefined,
    linkedin: row.linkedin ?? undefined,
    tech_stacks: row.tech_stacks ?? undefined,
    availability_status: row.availability_status ?? false,
    nda_status: row.nda_status ?? undefined,
    level: row.level ?? undefined,
    headline: row.headline ?? undefined,
    education: row.education ?? [],
    work_experience: (row.work_experience ?? []).map((exp) => ({
      ...exp,
      codev_id: row.id,
    })) as WorkExperience[],
    work_schedules: row.work_schedules ?? [],
    codev_points: row.codev_points ?? [],
  } as Codev;
}

export async function getProfileDetail(
  supabase: SupabaseClient,
  id: string,
): Promise<Codev | null> {
  const { data, error } = await supabase
    .from("codev")
    .select(PROFILE_DETAIL_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase query error (profile-detail):", error);
    return null;
  }

  if (!data) return null;
  return mapProfileDetail(data as ProfileDetailRow);
}

export async function getProfileDetailMeta(
  supabase: SupabaseClient,
  id: string,
): Promise<ProfileDetailMeta | null> {
  const { data, error } = await supabase
    .from("codev")
    .select(PROFILE_META_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase query error (profile-detail-meta):", error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    first_name: data.first_name ?? "",
    last_name: data.last_name ?? "",
    image_url: data.image_url ?? undefined,
  };
}

export const getCachedProfileDetail = unstable_cache(
  async (id: string) => getProfileDetail(createClientAnon(), id),
  ["profile-detail"],
  { revalidate: 3600, tags: ["profile-detail"] },
);

export const getCachedProfileDetailMeta = unstable_cache(
  async (id: string) => getProfileDetailMeta(createClientAnon(), id),
  ["profile-detail-meta"],
  { revalidate: 3600, tags: ["profile-detail"] },
);
