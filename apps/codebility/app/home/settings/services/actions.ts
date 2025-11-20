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
    console.log('\n🔍 ========== FETCHING PROJECTS ==========');
    console.log('📍 Function: getRealProjects()');
    console.log('📍 File: app/home/settings/services/actions.ts');

    const supabase = await createClientServerComponent();

    console.log('\n📤 SUPABASE QUERY:');
    console.log('  Table: projects');
    console.log('  Filter: public_display = true');
    console.log('  Order: created_at DESC');
    console.log('  Relations: project_categories -> projects_category');

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
      console.error('❌ Supabase query error:', error);
      throw error;
    }

    console.log('\n✅ Successfully fetched projects from database:', data?.length || 0);
    console.log('\n📦 RAW DATA SAMPLE (first project):');
    if (data && data.length > 0) {
      console.log('  Name:', data[0].name);
      console.log('  Categories (raw):', JSON.stringify(data[0].categories, null, 2));
    }

    console.log('\n🔄 FLATTENING CATEGORIES...');
    console.log('  Method: Extract projects_category from each category item');

    // Flatten the categories structure - same approach as getPublicProjects
    const projectsWithCategories = (data || []).map((project: any) => ({
      ...project,
      categories: project.categories?.map((cat: any) => cat.projects_category).filter(Boolean) || [],
    }));

    console.log('\n📦 FLATTENED DATA SAMPLE (first project):');
    if (projectsWithCategories && projectsWithCategories.length > 0) {
      console.log('  Name:', projectsWithCategories[0].name);
      console.log('  Categories (flattened):', JSON.stringify(projectsWithCategories[0].categories, null, 2));
    }

    // Log detailed category distribution for debugging
    console.log('\n📊 ========== DETAILED PROJECT CATEGORY BREAKDOWN ==========');
    projectsWithCategories.forEach((project: any, index: number) => {
      const categoryNames = project.categories?.map((c: any) => c.name).join(', ') || 'NO CATEGORIES';
      const categoryIds = project.categories?.map((c: any) => c.id).join(', ') || 'NO IDs';
      const hasImage = project.main_image ? '✅' : '❌';
      console.log(`${index + 1}. ${project.name}`);
      console.log(`   Categories: [${categoryNames}] (IDs: ${categoryIds})`);
      console.log(`   Has Image: ${hasImage} | Public: ${project.public_display ? '✅' : '❌'}`);
    });

    console.log('\n📈 ========== SUMMARY ==========');
    console.log(`TOTAL PROJECTS FETCHED: ${projectsWithCategories.length}`);

    const webProjects = projectsWithCategories.filter((p: any) => p.categories?.some((c: any) => c.id === 1));
    const mobileProjects = projectsWithCategories.filter((p: any) => p.categories?.some((c: any) => c.id === 2));
    const designProjects = projectsWithCategories.filter((p: any) => p.categories?.some((c: any) => c.id === 3));
    const aiProjects = projectsWithCategories.filter((p: any) => p.categories?.some((c: any) => c.id === 4));
    const cmsProjects = projectsWithCategories.filter((p: any) => p.categories?.some((c: any) => c.id === 5));

    console.log('\n📋 Projects by category:');
    console.log(`  🌐 Web (ID 1): ${webProjects.length} projects`);
    console.log(`  📱 Mobile (ID 2): ${mobileProjects.length} projects`);
    console.log(`  🎨 Design (ID 3): ${designProjects.length} projects`);
    console.log(`  🤖 AI Development (ID 4): ${aiProjects.length} projects`);
    console.log(`  📝 CMS (ID 5): ${cmsProjects.length} projects`);

    console.log('\n📝 CMS Projects Details:');
    if (cmsProjects.length > 0) {
      cmsProjects.forEach((p: any, idx: number) => {
        console.log(`  ${idx + 1}. ${p.name} (${p.main_image ? 'has image' : 'no image'})`);
      });
    } else {
      console.log('  ⚠️  NO CMS PROJECTS FOUND!');
    }

    console.log('\n========== END FETCHING PROJECTS ==========\n');

    return { data: projectsWithCategories as RealProject[], error: null };
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