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
        projects_category(
          id,
          name
        )
      `,
    );

    if (error) throw error;

    return data;
  }