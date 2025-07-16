import "server-only";

import { Client, Codev, Project, WorkExperience } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";



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
        project_category_id,
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
    )
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
