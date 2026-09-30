import { cacheLife, cacheTag } from "next/cache";

import { createClientAnon } from "@/lib/global/supabase-anon";
import type { Codev } from "@/types/global/codev";
import type { RealProject } from "@/types/global/proposal";

export async function getRealProjects() {
  "use cache";
  cacheLife("hours");
  cacheTag("proposal-projects");
  try {
    const supabase = createClientAnon();

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

export async function getCodevProfiles() {
  "use cache";
  cacheLife("hours");
  cacheTag("proposal-codevs");
  try {
    const supabase = createClientAnon();

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

    // Filter for active codevs and mentors
    const activeCodevs = (data || []).filter((c: any) => {
      const validStatuses = ['GRADUATED', 'TRAINING', 'MENTOR', 'ADMIN'];
      const isValidStatus = validStatuses.includes(c.internal_status);

      return isValidStatus;
    });

    return { data: activeCodevs as unknown as Codev[], error: null };
  } catch (error) {
    console.error('❌ Error fetching codev profiles:', error);
    return { data: [], error: 'Failed to fetch codev profiles' };
  }
}