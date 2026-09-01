"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { Codev } from "@/types/home/codev";
import { z } from "zod";

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

    // Filter for active codevs and mentors
    const activeCodevs = (data || []).filter((c: any) => {
      const validStatuses = ['GRADUATED', 'TRAINING', 'MENTOR', 'ADMIN'];
      const isValidStatus = validStatuses.includes(c.internal_status);

      return isValidStatus;
    });

    return { data: activeCodevs as Codev[], error: null };
  } catch (error) {
    console.error('❌ Error fetching codev profiles:', error);
    return { data: [], error: 'Failed to fetch codev profiles' };
  }
}

const serviceWriteSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  duration: z.string().min(1, "Duration is required"),
  features: z.array(z.string().min(1)).min(1, "At least one feature is required"),
  category: z.string().min(1, "Category is required"),
  is_active: z.boolean(),
});

type ServiceWriteInput = z.infer<typeof serviceWriteSchema>;

async function requireAdminUser():
  Promise<
    | { ok: true; supabase: Awaited<ReturnType<typeof createClientServerComponent>>; userId: string }
    | { ok: false; error: string }
  > {
  const supabase = await createClientServerComponent();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user.user) {
    return { ok: false, error: "Authentication required" };
  }

  const { data: userRole, error: roleError } = await supabase
    .from("codev")
    .select("role_id")
    .eq("id", user.user.id)
    .single();

  if (roleError || userRole?.role_id !== 1) {
    return { ok: false, error: "Admin access required" };
  }

  return { ok: true, supabase, userId: user.user.id };
}

export async function createService(formData: ServiceWriteInput) {
  try {
    const validated = serviceWriteSchema.parse(formData);
    const auth = await requireAdminUser();
    if (!auth.ok) {
      return { error: auth.error };
    }

    const { error } = await auth.supabase.from("services").insert({
      ...validated,
      created_by: auth.userId,
    });

    if (error) {
      console.error("Error creating service:", error);
      return { error: "Failed to create service" };
    }

    return { error: null };
  } catch (error) {
    console.error("Error creating service:", error);
    return { error: "Failed to create service" };
  }
}

export async function updateService(id: string, formData: ServiceWriteInput) {
  try {
    const validated = serviceWriteSchema.parse(formData);
    const auth = await requireAdminUser();
    if (!auth.ok) {
      return { error: auth.error };
    }

    const { error } = await auth.supabase
      .from("services")
      .update(validated)
      .eq("id", id);

    if (error) {
      console.error("Error updating service:", error);
      return { error: "Failed to update service" };
    }

    return { error: null };
  } catch (error) {
    console.error("Error updating service:", error);
    return { error: "Failed to update service" };
  }
}