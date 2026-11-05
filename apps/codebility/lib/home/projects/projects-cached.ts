import type {
  ProjectContributor,
  ProjectDetail,
  ProjectListItem,
} from "@/types/home/projects/projects";
import { cacheLife, cacheTag } from "next/cache";
import {
  CONTRIBUTOR_COLUMNS,
  PROJECT_DETAIL_COLUMNS,
  PROJECT_LIST_COLUMNS,
} from "@/constants/home/projects/projects";
import { normalizeProjectRole } from "@/constants/global/permissions";
import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { createClientAnon } from "@/lib/global/supabase-anon";

export async function getCachedProjects(): Promise<ProjectListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.projectsList);

  const { data, error } = await createClientAnon()
    .from("projects")
    .select(PROJECT_LIST_COLUMNS)
    .order("name", { ascending: true });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    status: row.status,
    projectCode: row.project_code,
    mainImage: row.main_image,
    techStack: row.tech_stack,
    startDate: row.start_date,
    endDate: row.end_date,
  }));
}

export async function getCachedProject(
  projectId: string,
): Promise<ProjectDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(`${CACHE_TAGS.projectDetail}-${projectId}`);

  const { data, error } = await createClientAnon()
    .from("projects")
    .select(PROJECT_DETAIL_COLUMNS)
    .eq("id", projectId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    tagline: data.tagline,
    status: data.status,
    projectCode: data.project_code,
    startDate: data.start_date,
    endDate: data.end_date,
    githubLink: data.github_link,
    websiteUrl: data.website_url,
    figmaLink: data.figma_link,
    meetingLink: data.meeting_link,
    mainImage: data.main_image,
    secondaryImage: data.secondary_image,
    gallery: Array.isArray(data.gallery)
      ? data.gallery.filter((item): item is string => typeof item === "string")
      : null,
    techStack: data.tech_stack,
    keyFeatures: Array.isArray(data.key_features)
      ? data.key_features.filter(
          (item): item is string => typeof item === "string",
        )
      : null,
  };
}

export async function getCachedContributors(
  projectId: string,
): Promise<ProjectContributor[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`${CACHE_TAGS.projectDetail}-${projectId}`);

  const { data, error } = await createClientAnon()
    .from("project_members")
    .select(CONTRIBUTOR_COLUMNS)
    .eq("project_id", projectId);

  if (error) throw error;

  return data.flatMap((row) => {
    const codev = row.codev;
    if (!codev || !row.codev_id) return [];

    return [
      {
        id: row.id,
        codevId: row.codev_id,
        role: normalizeProjectRole(row.role),
        joinedAt: row.joined_at,
        firstName: codev.first_name,
        lastName: codev.last_name,
        imageUrl: codev.image_url,
        displayPosition: codev.display_position,
        username: codev.username,
      },
    ];
  });
}
