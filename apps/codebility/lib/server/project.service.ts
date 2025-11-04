import { createClientServerComponent } from "@/utils/supabase/server";


export default async function getProjects() {
  const supabase = await createClientServerComponent();
  const { data, error } = await supabase.from("projects").select(
    `
        *,
        project_members (
          id,
          codev_id,
          role,
          joined_at,
          codev (
            first_name,
            last_name,
            image_url
          )
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

  // Flatten the categories structure for easier consumption
  const projectsWithCategories = data?.map((project) => ({
    ...project,
    categories: project.categories?.map((cat: any) => cat.projects_category).filter(Boolean) || [],
  }));

  return projectsWithCategories;
}

export async function getPublicProjects() {
  const supabase = await createClientServerComponent();
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        *,
        project_members (
          id,
          codev_id,
          role,
          joined_at,
          codev (
            first_name,
            last_name,
            image_url
          )
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

  // Flatten the categories structure for easier consumption
  const projectsWithCategories = data?.map((project) => ({
    ...project,
    categories: project.categories?.map((cat: any) => cat.projects_category).filter(Boolean) || [],
  }));

  return projectsWithCategories;
}
