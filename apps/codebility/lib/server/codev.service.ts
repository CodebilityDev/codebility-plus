import "server-only";

import { Client, Codev } from "@/types/home/codev";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

export const getCodevs = async ({
  filters = {},
}: {
  filters?: {
    id?: string;
    role_id?: number | string;
    application_status?: string;
  };
} = {}): Promise<{ error: any; data: Codev[] | null }> => {
  const supabase = getSupabaseServerComponentClient();

  let query = supabase.from("codev").select(
    `
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
    created_at,
    updated_at,
    education (
      id,
      codev_id,
      institution,
      degree,
      start_date,
      end_date,
      description
    ),
    work_experience (
      id,
      codev_id,
      position,
      description,
      date_from,
      date_to,
      company_name,
      location
    ),
    work_schedules (
      id,
      codev_id,
      days_of_week,
      start_time,
      end_time
    ),
    projects 
    `,
  );

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

  const normalizedData = data.map((codev) => ({
    ...codev,
    education: codev.education || [],
    work_experience: (codev.work_experience || []).map((exp) => ({
      ...exp,
      is_present: !exp.date_to,
    })),
    work_schedules: codev.work_schedules || [],
  }));

  return { error: null, data: normalizedData as Codev[] };
};

export const getClients = async (): Promise<{
  error: any;
  data: Client[] | null;
}> => {
  const supabase = getSupabaseServerComponentClient();

  const { data, error } = await supabase.from("clients").select("*");

  return { error, data: data || null };
};
