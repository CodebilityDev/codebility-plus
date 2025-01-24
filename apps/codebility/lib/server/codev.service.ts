import "server-only";

import { Codev } from "@/types/home/codev";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

export const getCodevs = async ({
  filters = {},
}: {
  filters?: { role_id?: number | string; application_status?: string };
} = {}): Promise<{ error: any; data: Codev[] | null }> => {
  const supabase = getSupabaseServerComponentClient();

  let query = supabase.from("codev").select(`
    id,
    first_name,
    last_name,
    email_address,
    phone_number,
    address,
    about,
    education(
      id,
      codev_id,
      institution,
      degree,
      start_date,
      end_date,
      description
    ),
    positions,
    display_position,
    portfolio_website,
    tech_stacks,
    image_url,
    availability_status,
    job_status,
    nda_status,
    level,
    application_status,
    rejected_count,
    facebook_link,
    linkedin,
    github,
    discord,
    years_of_experience,
    internal_status,
    role_id,
    created_at,
    updated_at,
    projects(
      id,
      name,
      description,
      status,
      github_link,
      website_url,
      figma_link
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
    console.error("Error fetching codevs:", error);
    return { error, data: null };
  }

  return { error: null, data };
};
