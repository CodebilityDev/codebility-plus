"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { Codev } from "@/types/home/codev";

export interface RealProject {
  id: string;
  name: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  main_image?: string;
  website_url?: string;
  github_link?: string;
  figma_link?: string;
  tech_stack?: string[];
  client_id?: string;
  created_at?: string;
  project_category_id?: number;
  projects_category?: {
    id: number;
    name: string;
    description?: string;
  } | null;
  categories?: {
    id: number;
    name: string;
    description?: string;
  }[];
}

// Fetch Real Projects from database
export async function getRealProjects() {
  try {
    const supabase = await createClientServerComponent();

    const { data, error} = await supabase
      .from('projects')
      .select(`
        *,
        categories:project_categories(
          projects_category(
            id,
            name,
            description
          )
        )
      `)
      .eq('public_display', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Flatten the categories structure - same approach as getPublicProjects
    const projectsWithCategories = (data || []).map((project: any) => ({
      ...project,
      categories: project.categories?.map((cat: any) => cat.projects_category).filter(Boolean) || [],
    }));

    return { data: projectsWithCategories as RealProject[], error: null };
  } catch (error) {
    console.error('Error fetching real projects:', error);
    return { data: null, error: 'Failed to fetch real projects' };
  }
}

// Fetch Codev Profiles for hire - with role information (Codevs and Mentors)
export async function getCodevProfiles() {
  try {
    const supabase = await createClientServerComponent();

    // Fetch codevs and mentors with role information
    const { data, error } = await supabase
      .from('codev')
      .select(`
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
      `)
      .in('role_id', [5, 10]) // Include both Mentor (5) and Codev (10)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error in getCodevProfiles:', error);
      throw error;
    }

    console.log('✅ Raw codev data fetched (before filtering):', data?.length || 0);

    // Filter for active codevs and mentors
    const activeCodevs = (data || []).filter((c: any) => {
      const validStatuses = ['GRADUATED', 'TRAINING', 'MENTOR', 'ADMIN'];
      const isValidStatus = validStatuses.includes(c.internal_status);

      if (!isValidStatus) {
        console.log(`⚠️ Filtered out: ${c.first_name} ${c.last_name} - Status: ${c.internal_status}, Role ID: ${c.role_id}`);
      }

      return isValidStatus;
    });

    console.log('✅ Active codevs after filtering:', activeCodevs.length);
    console.log('📋 Role breakdown:', activeCodevs.map((c: any) => ({
      name: `${c.first_name} ${c.last_name}`,
      role: c.role,
      role_id: c.role_id,
      internal_status: c.internal_status
    })));

    return { data: activeCodevs as Codev[], error: null };
  } catch (error) {
    console.error('❌ Error fetching codev profiles:', error);
    return { data: [], error: 'Failed to fetch codev profiles' };
  }
}