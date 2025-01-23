import "server-only";

import { Codev } from "@/types/home/codev";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

const adminRoleId = 1;

export const getCodevs = async (
  id?: string,
): Promise<{ error: any; data: Codev | Codev[] | null }> => {
  const supabase = getSupabaseServerComponentClient();

  let codevQuery = supabase.from("codev").select(
    `
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
    `,
  );

  if (id) {
    codevQuery = codevQuery.eq("id", id);
  }

  const { data: codevs, error } = await codevQuery;

  if (error) return { error, data: null };

  const data = codevs.map<Codev>((codev) => ({
    id: codev.id,
    first_name: codev.first_name,
    last_name: codev.last_name,
    email_address: codev.email_address,
    phone_number: codev.phone_number,
    address: codev.address || null,
    about: codev.about || null,
    education: codev.education || [],
    positions: codev.positions || [],
    display_position: codev.display_position,
    portfolio_website: codev.portfolio_website,
    tech_stacks: codev.tech_stacks || [],
    image_url: codev.image_url || null,
    availability_status: codev.availability_status,
    job_status: codev.job_status || null,
    nda_status: codev.nda_status,
    level: codev.level || {},
    application_status: codev.application_status,
    rejected_count: codev.rejected_count,
    facebook_link: codev.facebook_link,
    linkedin: codev.linkedin,
    github: codev.github,
    discord: codev.discord,
    projects: codev.projects || [],
    years_of_experience: codev.years_of_experience,
    role_id: codev.role_id,
    internal_status: codev.internal_status,
    created_at: codev.created_at,
    updated_at: codev.updated_at,
  }));

  if (id) return { error: null, data: data[0] || null };

  return { error: null, data };
};

export const getAdmins = async (): Promise<{
  error: any;
  data: Codev[] | null;
}> => {
  const supabase = getSupabaseServerComponentClient();

  const { data, error } = await supabase
    .from("codev")
    .select(
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
      education(
        id,
        codev_id,
        institution,
        degree,
        start_date,
        end_date,
        description
      ),
      projects(
        id,
        name,
        description,
        status,
        github_link,
        website_url,
        figma_link
      )
    `,
    )
    .eq("role_id", adminRoleId);

  if (error) return { error, data: null };

  const admins = data.map<Codev>((codev) => ({
    id: codev.id,
    first_name: codev.first_name,
    last_name: codev.last_name,
    email_address: codev.email_address,
    phone_number: codev.phone_number,
    address: codev.address || null,
    about: codev.about || null,
    positions: codev.positions || [],
    display_position: codev.display_position,
    portfolio_website: codev.portfolio_website,
    tech_stacks: codev.tech_stacks || [],
    image_url: codev.image_url || null,
    availability_status: codev.availability_status,
    job_status: codev.job_status || null,
    nda_status: codev.nda_status,
    level: codev.level || {}, // Ensure JSONB field is defaulted
    application_status: codev.application_status,
    rejected_count: codev.rejected_count,
    facebook_link: codev.facebook_link,
    linkedin: codev.linkedin,
    github: codev.github,
    discord: codev.discord,
    years_of_experience: codev.years_of_experience,
    role_id: codev.role_id,
    internal_status: codev.internal_status,
    created_at: codev.created_at,
    updated_at: codev.updated_at,
    education: codev.education || [], // Relational data for education
    projects: codev.projects || [], // Relational data for projects
  }));

  return { error: null, data: admins };
};
