"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { getCodevs } from "@/lib/server/codev.service";
import { getPrioritizedAndFilteredCodevs } from "@/utils/codev-priority";
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
    id: string;
    name: string;
  };
}

// Fetch Real Projects from database
export async function getRealProjects() {
  try {
    const supabase = await createClientServerComponent();
    
    const { data, error } = await supabase
      .from('projects')  // Fixed table name
      .select(`
        id, 
        name, 
        description, 
        status, 
        main_image, 
        website_url, 
        github_link, 
        figma_link, 
        tech_stack, 
        created_at,
        project_category_id,
        projects_category(
          id,
          name
        )
      `)
      .eq('public_display', true)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      throw error;
    }
    
    return { data: data as RealProject[], error: null };
  } catch (error) {
    console.error('Error fetching real projects:', error);
    return { data: null, error: 'Failed to fetch real projects' };
  }
}

// Fetch Codev Profiles for hire - using the same logic as /codevs page
export async function getCodevProfiles() {
  try {
    const { data: allCodevs, error } = await getCodevs({ 
      filters: { role_id: 10 } // Only Codevs with role_id 10, same as /codevs page
    });

    if (error) {
      throw error;
    }

    const codevsArray: Codev[] = Array.isArray(allCodevs) ? allCodevs : [];

    // Use the same filtering logic as /codevs page
    const sortedCodevs = getPrioritizedAndFilteredCodevs(
      codevsArray,
      { activeStatus: ["active"] },
      true, // filterAdminAndFailed
    );
    
    return { data: sortedCodevs, error: null }; // Return ALL codevs for comprehensive showcase
  } catch (error) {
    console.error('Error fetching codev profiles:', error);
    return { data: null, error: 'Failed to fetch codev profiles' };
  }
}