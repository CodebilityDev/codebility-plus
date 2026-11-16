import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { createClientAnon } from "@/lib/global/supabase-anon";
import type { Codev } from "@/types/global/codev";
import type { RealProject } from "@/types/global/proposal";

const PROJECT_SELECT = `
  id,
  name,
  main_image,
  tech_stack,
  categories:project_categories(
    projects_category(
      id,
      name,
      description
    )
  )
`;
const PROJECT_LIMIT = 100;
const CODEV_SELECT = `
  id,
  first_name,
  last_name,
  image_url,
  tech_stacks,
  display_position,
  positions,
  role_id,
  role:roles(id, name),
  availability_status,
  internal_status,
  application_status
`;
const CODEV_LIMIT = 50;
const ACTIVE_INTERNAL_STATUSES = ["GRADUATED", "TRAINING", "MENTOR", "ADMIN"];

export async function getRealProjects(): Promise<RealProject[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.proposalProjects);

  const supabase = createClientAnon();

  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('public_display', true)
    .order('created_at', { ascending: false })
    .limit(PROJECT_LIMIT);

  if (error) {
    throw new Error(`Failed to load proposal projects: ${error.message}`, {
      cause: error,
    });
  }

  // Flatten the categories structure - same approach as getPublicProjects
  const projectsWithCategories = data.map((project) => ({
    ...project,
    categories: project.categories.map((cat) => cat.projects_category).filter(Boolean),
  }));

  return projectsWithCategories as RealProject[];
}

export async function getCodevProfiles(): Promise<Codev[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.proposalCodevs);

  const supabase = createClientAnon();

  // Fetch codevs and mentors with role information
  const { data, error } = await supabase
    .from('codev')
    .select(CODEV_SELECT)
    .in('role_id', [5, 10]) // Include both Mentor (5) and Codev (10)
    .in('internal_status', ACTIVE_INTERNAL_STATUSES)
    .order('created_at', { ascending: false })
    .limit(CODEV_LIMIT);

  if (error) {
    throw new Error(`Failed to load proposal codevs: ${error.message}`, {
      cause: error,
    });
  }

  return data as unknown as Codev[];
}
