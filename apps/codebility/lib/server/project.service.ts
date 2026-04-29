import { createClientServerComponent } from "@/utils/supabase/server";


/**
 * Fetch all projects with members using two-query approach to avoid RLS filtering.
 *
 * IMPORTANT: DO NOT use nested codev join in project_members query!
 * PostgREST applies RLS on the codev table which silently drops members.
 * Always use two-query approach: fetch codev_ids first, then fetch codev records separately.
 */
export default async function getProjects() {
  const supabase = await createClientServerComponent();

  // Step 1: Fetch projects with project_members (no codev join!)
  const { data, error } = await supabase.from("projects").select(
    `
        *,
        project_members (
          id,
          codev_id,
          role,
          joined_at
        ),
        categories:project_categories(
          projects_category(
            id,
            name,
            description
          )
        )
      `,
  );

  if (error) throw error;
  if (!data || data.length === 0) return [];

  // Step 2: Collect all unique codev_ids from all projects
  const allCodevIds = new Set<string>();
  data.forEach((project) => {
    project.project_members?.forEach((pm: any) => {
      if (pm.codev_id) allCodevIds.add(pm.codev_id);
    });
  });

  // Step 3: Fetch codev records separately to bypass RLS join filtering
  let codevMap = new Map<string, any>();

  if (allCodevIds.size > 0) {
    const { data: codevs, error: codevError } = await supabase
      .from("codev")
      .select("id, first_name, last_name, image_url")
      .in("id", Array.from(allCodevIds));

    if (codevError) {
      console.error("Error fetching codev records for projects:", codevError);
    } else {
      codevs?.forEach((c: any) => codevMap.set(c.id, c));
    }
  }

  // Step 4: Merge codev data back into project_members
  const projectsWithMembers = data.map((project) => ({
    ...project,
    project_members: project.project_members?.map((pm: any) => ({
      ...pm,
      codev: codevMap.get(pm.codev_id) ?? null,
    })),
    categories: project.categories?.map((cat: any) => cat.projects_category).filter(Boolean) || [],
  }));

  return projectsWithMembers;
}

/**
 * Fetch public projects with members using two-query approach to avoid RLS filtering.
 *
 * IMPORTANT: DO NOT use nested codev join in project_members query!
 * PostgREST applies RLS on the codev table which silently drops members.
 * Always use two-query approach: fetch codev_ids first, then fetch codev records separately.
 */
export async function getPublicProjects() {
  const supabase = await createClientServerComponent();

  // Step 1: Fetch projects with project_members (no codev join!)
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        *,
        project_members (
          id,
          codev_id,
          role,
          joined_at
        ),
        categories:project_categories(
          projects_category(
            id,
            name,
            description
          )
        )
      `,
    )
    .eq("public_display", true);

  if (error) throw error;
  if (!data || data.length === 0) return [];

  // Step 2: Collect all unique codev_ids from all projects
  const allCodevIds = new Set<string>();
  data.forEach((project) => {
    project.project_members?.forEach((pm: any) => {
      if (pm.codev_id) allCodevIds.add(pm.codev_id);
    });
  });

  // Step 3: Fetch codev records separately to bypass RLS join filtering
  let codevMap = new Map<string, any>();

  if (allCodevIds.size > 0) {
    const { data: codevs, error: codevError } = await supabase
      .from("codev")
      .select("id, first_name, last_name, image_url")
      .in("id", Array.from(allCodevIds));

    if (codevError) {
      console.error("Error fetching codev records for public projects:", codevError);
    } else {
      codevs?.forEach((c: any) => codevMap.set(c.id, c));
    }
  }

  // Step 4: Merge codev data back into project_members
  const projectsWithMembers = data.map((project) => ({
    ...project,
    project_members: project.project_members?.map((pm: any) => ({
      ...pm,
      codev: codevMap.get(pm.codev_id) ?? null,
    })),
    categories: project.categories?.map((cat: any) => cat.projects_category).filter(Boolean) || [],
  }));

  return projectsWithMembers;
}
