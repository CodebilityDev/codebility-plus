"use server";

import { revalidatePath } from "next/cache";
import { Client, Codev, Project } from "@/types/home/codev";
import { deleteImage, getImagePath } from "@/utils/uploadImage";
import { createClientServerComponent } from "@/utils/supabase/server";
import { invalidateCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";

interface DbProjectMember {
  project: {
    id: string;
    name: string;
    status: string;
    kanban_display: boolean;
    public_display: boolean
  };
  role: string;
  joined_at: string;
}

interface ProjectMemberData {
  codev_id: string;
  role: string;
}

export interface SimpleMemberData {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  display_position: string | null;
  image_url: string | null;
  role: string;
  joined_at: string;
}

interface ProjectMemberResponse {
  role: string;
  joined_at: string;
  codev: {
    id: string;
    first_name: string;
    last_name: string;
    email_address: string;
    display_position: string | null;
    image_url: string | null;
  };
}

interface DbProjectMemberResponse {
  role: string;
  joined_at: string;
  codev: {
    id: string;
    first_name: string;
    last_name: string;
    email_address: string;
    display_position: string | null;
    image_url: string | null;
  };
}

export async function getUserProjects(): Promise<{
  error: any;
  data: { project: Project; role: string }[] | null;
}> {
  const supabase = await createClientServerComponent();
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Error fetching user:", userError);
      return { error: { message: "User not authenticated" }, data: null };
    }

    const { data: codevData, error: codevError } = await supabase
      .from("codev")
      .select("id")
      .eq("email_address", user.email)
      .single();

    if (codevError || !codevData) {
      console.error("Error fetching codev_id:", codevError);
      return { error: { message: "User profile not found" }, data: null };
    }

    const userCodevId = codevData.id;

    interface DbProject {
      id: string;
      name: string;
      status: string | null;
      kanban_display: boolean | null;
      meeting_link: string | null;
      public_display: boolean | null;
    }

    interface ProjectMember {
      project_id: string;
      role: string;
      project: DbProject;
    }

    const { data: projectMembers, error: projectMembersError } = await supabase
      .from("project_members")
      .select(
        `
        project_id,
        role,
        project:project_id (
          id,
          name,
          status,
          kanban_display,
          public_display,
          meeting_link
        )
      `,
      )
      .eq("codev_id", userCodevId)
      // ── CBP-116: added "sublead" so sublead-assigned users see their projects
      .in("role", ["team_leader", "member", "sublead"]) as { data: ProjectMember[] | null; error: any };

    if (projectMembersError) {
      console.error("Error fetching user projects:", projectMembersError);
      return { error: { message: "Failed to fetch user projects" }, data: null };
    }

    if (!projectMembers || projectMembers.length === 0) {
      return { error: null, data: null };
    }

    const userProjects = projectMembers.map((pm) => ({
      project: {
        id: pm.project.id,
        name: pm.project.name,
        status: pm.project.status || "pending",
        kanban_display: pm.project.kanban_display ?? false,
        public_display: pm.project.public_display ?? false,
        meeting_link: pm.project.meeting_link ?? null,
      } as Project,
      role: pm.role,
    }));

    return { error: null, data: userProjects };
  } catch (error) {
    console.error("Unexpected error fetching user projects:", error);
    return { error: { message: "Unexpected error occurred" }, data: null };
  }
}

export async function createProject(
  formData: FormData,
  selectedMembers: Codev[],
  teamLeaderId: string,
) {
  const supabase = await createClientServerComponent();

  try {
    const techStackData = formData.get("tech_stack");
    let techStack: string[] | null = null;
    if (techStackData) {
      try {
        techStack = JSON.parse(techStackData as string) as string[];
      } catch (error) {
        console.warn("Invalid tech stack data:", error);
      }
    }

    const categoryIdsData = formData.get("category_ids");
    let categoryIds: number[] = [];
    if (categoryIdsData) {
      try {
        categoryIds = JSON.parse(categoryIdsData as string) as number[];
      } catch (error) {
        console.warn("Invalid category IDs data:", error);
      }
    }

    const keyFeaturesData = formData.get("key_features");
    let keyFeatures: string[] | null = null;
    if (keyFeaturesData) {
      try {
        keyFeatures = JSON.parse(keyFeaturesData as string) as string[];
      } catch (error) {
        console.warn("Invalid key_features data:", error);
      }
    }

    const galleryData = formData.get("gallery");
    let gallery: string[] | null = null;
    if (galleryData) {
      try {
        gallery = JSON.parse(galleryData as string) as string[];
      } catch (error) {
        console.warn("Invalid gallery data:", error);
      }
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        name: formData.get("name"),
        description: formData.get("description"),
        tagline: formData.get("tagline"),
        key_features: keyFeatures,
        gallery: gallery,
        github_link: formData.get("github_link"),
        website_url: formData.get("website_url"),
        figma_link: formData.get("figma_link"),
        client_id: formData.get("client_id"),
        start_date: formData.get("start_date"),
        main_image: formData.get("main_image"),
        tech_stack: techStack,
        status: "pending",
      })
      .select()
      .single();

    if (projectError) throw projectError;

    if (categoryIds.length > 0) {
      const categoryInserts = categoryIds.map((categoryId) => ({
        project_id: project.id,
        category_id: categoryId,
      }));

      const { error: categoryError } = await supabase
        .from("project_categories")
        .insert(categoryInserts);

      if (categoryError) {
        console.error("Error inserting project categories:", categoryError);
      }
    }

    const memberInserts = [
      {
        project_id: project.id,
        codev_id: teamLeaderId,
        role: "team_leader",
        joined_at: new Date().toISOString(),
      },
      ...selectedMembers
        .filter((member) => member.id !== teamLeaderId)
        .map((member) => ({
          project_id: project.id,
          codev_id: member.id,
          role: "member",
          joined_at: new Date().toISOString(),
        })),
    ];

    const { error: membersError } = await supabase
      .from("project_members")
      .insert(memberInserts);

    if (membersError) throw membersError;

    const { error: boardError } = await supabase.from("kanban_boards").insert({
      name: `${project.name} Board`,
      project_id: project.id,
      description: `Default board for ${project.name}`,
    });

    if (boardError) throw boardError;

    await invalidateCache(cacheKeys.projects.all);

    revalidatePath("/projects");
    revalidatePath("/services");
    return { success: true, data: project };
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create project",
    };
  }
}

export async function updateStatus(
  status: string,
  projectId: string,
) {
  const supabase = await createClientServerComponent();
  const { error: projectError } = await supabase
    .from("projects")
    .update({ status: status })
    .eq("id", projectId)
    .select();

  if (projectError)
    console.error("Error in updating projects and kanban board:", projectError);

  await invalidateCache(cacheKeys.projects.all);

  revalidatePath("/home/projects");
  revalidatePath("/services");

  return { success: true, projectId, status };
}

export async function updateKanbanDisplaySwitch(
  kanbanDisplay: boolean,
  projectId: string,
) {
  const supabase = await createClientServerComponent();
  const { error: projectError } = await supabase
    .from("projects")
    .update({ kanban_display: kanbanDisplay })
    .eq("id", projectId)
    .select();

  if (projectError)
    console.error("Error in updating projects and kanban board:", projectError);

  return { success: true, projectId, kanbanDisplay };
}

export async function updatePublicDisplaySwitch(
  publicDisplay: boolean,
  projectId: string,
) {
  const supabase = await createClientServerComponent();
  const { error: projectError } = await supabase
    .from("projects")
    .update({ public_display: publicDisplay })
    .eq("id", projectId)
    .select();

  if (projectError)
    console.error("Error in updating projects and kanban board:", projectError);

  await invalidateCache(cacheKeys.projects.all);

  revalidatePath("/home/projects");
  revalidatePath("/services");

  return { success: true, projectId, publicDisplay };
}

export async function updateProject(projectId: string, formData: FormData) {
  const supabase = await createClientServerComponent();

  try {
    const projectMembersData = formData.get("project_members");
    const projectMembers = projectMembersData
      ? (JSON.parse(projectMembersData as string) as ProjectMemberData[])
      : null;

    const techStackData = formData.get("tech_stack");
    let techStack: string[] | null = null;
    if (techStackData) {
      try {
        techStack = JSON.parse(techStackData as string) as string[];
      } catch (error) {
        console.warn("Invalid tech stack data:", error);
      }
    }

    const categoryIdsData = formData.get("category_ids");
    let categoryIds: number[] | null = null;
    if (categoryIdsData) {
      try {
        categoryIds = JSON.parse(categoryIdsData as string) as number[];
      } catch (error) {
        console.warn("Invalid category IDs data:", error);
      }
    }

    const keyFeaturesData = formData.get("key_features");
    let keyFeatures: string[] | null = null;
    if (keyFeaturesData) {
      try {
        keyFeatures = JSON.parse(keyFeaturesData as string) as string[];
      } catch (error) {
        console.warn("Invalid key_features data:", error);
      }
    }

    const galleryData = formData.get("gallery");
    let gallery: string[] | null = null;
    if (galleryData) {
      try {
        gallery = JSON.parse(galleryData as string) as string[];
      } catch (error) {
        console.warn("Invalid gallery data:", error);
      }
    }

    const updateData: any = {};
    for (const [key, value] of formData.entries()) {
      if (
        key !== "project_members" &&
        key !== "tech_stack" &&
        key !== "category_ids" &&
        key !== "key_features" &&
        key !== "gallery"
      ) {
        updateData[key] = value;
      }
    }

    if (techStack) updateData.tech_stack = techStack;
    if (keyFeatures) updateData.key_features = keyFeatures;
    if (gallery) updateData.gallery = gallery;

    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select();

    if (projectError) {
      console.error("Supabase error updating project:", projectError);
      throw projectError;
    }

    if (projectMembers && Array.isArray(projectMembers)) {
      const { data: existingMembers, error: membersError } = await supabase
        .from("project_members")
        .select("codev_id, joined_at")
        .eq("project_id", projectId);

      if (membersError) throw membersError;

      // Preserve joined_at for all existing members (including sublead)
      const joinedAtMap = new Map(
        existingMembers?.map(m => [m.codev_id, m.joined_at]) ?? []
      );

      const { error: deleteError } = await supabase
        .from("project_members")
        .delete()
        .eq("project_id", projectId);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("project_members")
        .insert(
          projectMembers.map((member: ProjectMemberData) => ({
            project_id: projectId,
            codev_id: member.codev_id,
            role: member.role,
            joined_at: joinedAtMap.get(member.codev_id) ?? new Date().toISOString(),
          })),
        );

      if (insertError) throw insertError;
    }

    if (categoryIds !== null) {
      const { error: deleteCategoriesError } = await supabase
        .from("project_categories")
        .delete()
        .eq("project_id", projectId);

      if (deleteCategoriesError) {
        console.error("Error deleting project categories:", deleteCategoriesError);
      }

      if (categoryIds.length > 0) {
        const categoryInserts = categoryIds.map((categoryId) => ({
          project_id: projectId,
          category_id: categoryId,
        }));

        const { error: insertCategoriesError } = await supabase
          .from("project_categories")
          .insert(categoryInserts);

        if (insertCategoriesError) {
          console.error("Error inserting project categories:", insertCategoriesError);
        }
      }
    }

    await invalidateCache(cacheKeys.projects.all);

    revalidatePath("/projects");
    revalidatePath("/services");
    return { success: true, data: projectData };
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update project",
    };
  }
}

export async function deleteProject(projectId: string) {
  const supabase = await createClientServerComponent();

  try {
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select()
      .eq("id", projectId)
      .single();

    if (fetchError) throw fetchError;

    if (project.main_image) {
      const imagePath = await getImagePath(project.main_image);
      if (imagePath) {
        await deleteImage(imagePath, "projects");
      }
    }

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (deleteError) throw deleteError;

    await invalidateCache(cacheKeys.projects.all);

    revalidatePath("/projects");
    revalidatePath("/services");
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete project",
    };
  }
}

export const getTeamLead = async (
  projectId: string,
): Promise<{
  error: any;
  data: SimpleMemberData | null;
}> => {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = (await supabase
      .from("project_members")
      .select(
        `
        role,
        joined_at,
        codev:codev_id (
          id,
          first_name,
          last_name,
          email_address,
          display_position,
          image_url
        )
      `,
      )
      .eq("project_id", projectId)
      .eq("role", "team_leader")
      .single()) as { data: DbProjectMemberResponse | null; error: any };

    if (error) {
      console.error("Error fetching team lead:", error);
      return { error, data: null };
    }

    if (!data?.codev) {
      return { error: null, data: null };
    }

    const teamLead: SimpleMemberData = {
      id: data.codev.id,
      first_name: data.codev.first_name,
      last_name: data.codev.last_name,
      email_address: data.codev.email_address,
      display_position: data.codev.display_position,
      image_url: data.codev.image_url,
      role: data.role,
      joined_at: data.joined_at,
    };

    return { error: null, data: teamLead };
  } catch (error) {
    console.error("Unexpected error fetching team lead:", error);
    return { error, data: null };
  }
};

// ── CBP-116: getSubLead ───────────────────────────────────────────────────────
// Mirrors getTeamLead() exactly. Uses maybeSingle() instead of single()
// because sublead is optional — no row is valid and should not throw.
export const getSubLead = async (
  projectId: string,
): Promise<{
  error: any;
  data: SimpleMemberData | null;
}> => {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = (await supabase
      .from("project_members")
      .select(
        `
        role,
        joined_at,
        codev:codev_id (
          id,
          first_name,
          last_name,
          email_address,
          display_position,
          image_url
        )
      `,
      )
      .eq("project_id", projectId)
      .eq("role", "sublead")
      .maybeSingle()) as { data: DbProjectMemberResponse | null; error: any };

    if (error) {
      console.error("Error fetching sublead:", error);
      return { error, data: null };
    }

    if (!data?.codev) {
      return { error: null, data: null };
    }

    const subLead: SimpleMemberData = {
      id: data.codev.id,
      first_name: data.codev.first_name,
      last_name: data.codev.last_name,
      email_address: data.codev.email_address,
      display_position: data.codev.display_position,
      image_url: data.codev.image_url,
      role: data.role,
      joined_at: data.joined_at,
    };

    return { error: null, data: subLead };
  } catch (error) {
    console.error("Unexpected error fetching sublead:", error);
    return { error, data: null };
  }
};
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch project members via two-query approach to avoid RLS/join dropouts.
 * Step 1: get codev_ids from project_members
 * Step 2: fetch codev records separately
 * Step 3: merge manually
 */
export const getMembers = async (
  projectId: string,
): Promise<{
  error: any;
  data: SimpleMemberData[] | null;
}> => {
  const supabase = await createClientServerComponent();

  try {
    const { data: projectMembers, error: pmError } = await supabase
      .from("project_members")
      .select("codev_id, role, joined_at")
      .eq("project_id", projectId)
      .eq("role", "member");

    if (pmError) {
      console.error("❌ Error fetching project members:", pmError);
      return { error: pmError, data: null };
    }

    if (!projectMembers || projectMembers.length === 0) {
      return { error: null, data: [] };
    }

    const codevIds = projectMembers.map(pm => pm.codev_id);

    const { data: codevs, error: codevError } = await supabase
      .from("codev")
      .select("id, first_name, last_name, email_address, display_position, image_url")
      .in("id", codevIds);

    if (codevError) {
      console.error("❌ Error fetching codev details:", codevError);
      return { error: codevError, data: null };
    }

    const members = projectMembers.map(pm => {
      const codev = codevs?.find(c => c.id === pm.codev_id);

      if (!codev) {
        console.warn(`⚠️ Missing codev record for member: ${pm.codev_id}`);
        return null;
      }

      return {
        id: codev.id,
        first_name: codev.first_name,
        last_name: codev.last_name,
        email_address: codev.email_address,
        display_position: codev.display_position,
        image_url: codev.image_url,
        role: pm.role,
        joined_at: pm.joined_at,
      };
    }).filter(Boolean) as SimpleMemberData[];

    return { error: null, data: members };
  } catch (error) {
    console.error("❌ Unexpected error fetching members:", error);
    return { error, data: null };
  }
};

/**
 * Update project members with joined_at preservation.
 */
export const updateProjectMembers = async (
  projectId: string,
  members: Codev[],
  teamLeaderId: string,
): Promise<{ success: boolean; error?: string }> => {
  console.log('🔧 [updateProjectMembers] Server-side update starting');
  console.log('   Project ID:', projectId);
  console.log('   Members to add:', members.length);
  console.log('   Team Leader ID:', teamLeaderId);

  const supabase = await createClientServerComponent();

  try {
    const { data: existingMembers, error: fetchError } = await supabase
      .from("project_members")
      .select("codev_id, joined_at")
      .eq("project_id", projectId);

    if (fetchError) throw fetchError;

    console.log('   Existing members in DB:', existingMembers?.length ?? 0);

    const joinedAtMap = new Map(
      existingMembers?.map(m => [m.codev_id, m.joined_at]) ?? []
    );

    const { error: deleteError } = await supabase
      .from("project_members")
      .delete()
      .eq("project_id", projectId);

    if (deleteError) throw deleteError;

    console.log('   Old members deleted, preparing inserts...');

    const memberInserts = members.map((member) => ({
      project_id: projectId,
      codev_id: member.id,
      role: member.id === teamLeaderId ? "team_leader" : "member",
      joined_at: joinedAtMap.get(member.id) ?? new Date().toISOString(),
    }));

    console.log('   Inserting members:', memberInserts.length);
    console.log('   Member IDs:', memberInserts.map(m => m.codev_id));
    console.log('   Roles:', memberInserts.map(m => m.role));

    const { error: insertError } = await supabase
      .from("project_members")
      .insert(memberInserts);

    if (insertError) throw insertError;

    console.log('✅ [updateProjectMembers] Successfully inserted', memberInserts.length, 'members');

    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("❌ [updateProjectMembers] Error updating project members:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * ─── PATCH: Fix RLS filtering issue ──────────────────────────────────────────
 * Use two-query approach to avoid PostgREST join RLS filtering that silently
 * drops users. Same pattern as getProjectByID() and getMembers().
 *
 * IMPORTANT: Uses anon client (no auth) to bypass RLS policies that may filter
 * role_id field. This matches the landing page behavior where all mentors are visible.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const getProjectCodevs = async (filters = {}): Promise<Codev[]> => {
  // Use anon client to avoid RLS filtering of role_id field (same as landing page)
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const selectFields = `
    id,
    first_name,
    last_name,
    email_address,
    image_url,
    positions,
    tech_stacks,
    display_position,
    internal_status,
    role_id
  `;

  // Step 1: Fetch users by role in separate queries to avoid RLS corrupting role_id field
  // When fetching all users without filtering by role_id, RLS policy corrupts the role_id field.
  // Solution: Fetch each role separately (like landing page does), then combine results.

  const roleIds = [1, 5, 7, 10]; // Admin, Mentor, Applicant, Codev

  const queries = roleIds.map(roleId =>
    supabase.from("codev").select(selectFields).eq("role_id", roleId)
  );

  // Also fetch users with null role_id or other role_ids
  queries.push(
    supabase.from("codev").select(selectFields).is("role_id", null)
  );

  const results = await Promise.all(queries);

  // Combine all results
  let codevs: any[] = [];
  results.forEach(({ data, error }, index) => {
    if (error) {
      console.error(`Error fetching role_id ${index < roleIds.length ? roleIds[index] : 'null'}:`, error);
    } else if (data) {
      codevs = codevs.concat(data);
    }
  });

  // Apply additional filters if provided
  if (Object.keys(filters).length > 0) {
    codevs = codevs.filter(codev => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === undefined) return true;
        return codev[key] === value;
      });
    });
  }

  if (codevs.length === 0) {
    return [];
  }

  // Step 2: Fetch project_members separately for all codevs
  const codevIds = codevs.map(c => c.id);

  const { data: projectMembers, error: pmError } = await supabase
    .from("project_members")
    .select(`
      codev_id,
      project_id,
      role,
      joined_at,
      project:project_id (
        id,
        name,
        status,
        kanban_display,
        public_display
      )
    `)
    .in("codev_id", codevIds);

  if (pmError) {
    console.error("Error fetching project members:", pmError);
  }

  // Step 3: Merge project_members data back into codevs
  return codevs.map((codev: any) => {
    const codevProjectMembers = projectMembers?.filter(pm => pm.codev_id === codev.id) || [];

    const projects = codevProjectMembers.map((pm: any) => {
      const project: Project & { role: string; joined_at: string } = {
        id: pm.project.id,
        name: pm.project.name,
        role: pm.role,
        joined_at: pm.joined_at,
        status: pm.project.status,
        kanban_display: pm.project.kanban_display,
        public_display: pm.project.public_display,
      };
      return project;
    });

    return {
      ...codev,
      positions: codev.positions || [],
      tech_stacks: codev.tech_stacks || [],
      projects,
    } as Codev;
  });
};

export const getProjectClients = async (): Promise<Client[]> => {
  const supabase = await createClientServerComponent();

  const { data, error } = await supabase
    .from("clients")
    .select("id, name, email, company_logo");

  if (error) {
    console.error("Error fetching Clients:", error);
    throw new Error("Failed to fetch Clients");
  }

  return data || [];
};

export const getProjectCategories = async () => {
  const supabase = await createClientServerComponent();
  const { data, error } = await supabase
    .from("projects_category")
    .select("id, name, description");

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }

  return data || [];
};

export const getProjectCategoriesForProject = async (projectId: string) => {
  const supabase = await createClientServerComponent();
  const { data, error } = await supabase
    .from("project_categories")
    .select(`
      category_id,
      projects_category (
        id,
        name,
        description
      )
    `)
    .eq("project_id", projectId);

  if (error) {
    console.error("Error fetching project categories:", error);
    throw new Error("Failed to fetch project categories");
  }

  return data?.map((item: any) => item.projects_category).filter(Boolean) || [];
};

export const addCategoriesToProject = async (
  projectId: string,
  categoryIds: number[]
) => {
  const supabase = await createClientServerComponent();

  const inserts = categoryIds.map((categoryId) => ({
    project_id: projectId,
    category_id: categoryId,
  }));

  const { error } = await supabase
    .from("project_categories")
    .insert(inserts);

  if (error) {
    console.error("Error adding categories to project:", error);
    throw new Error("Failed to add categories to project");
  }

  return { success: true };
};

export const removeCategoryFromProject = async (
  projectId: string,
  categoryId: number
) => {
  const supabase = await createClientServerComponent();

  const { error } = await supabase
    .from("project_categories")
    .delete()
    .eq("project_id", projectId)
    .eq("category_id", categoryId);

  if (error) {
    console.error("Error removing category from project:", error);
    throw new Error("Failed to remove category from project");
  }

  return { success: true };
};

export const replaceProjectCategories = async (
  projectId: string,
  categoryIds: number[]
) => {
  const supabase = await createClientServerComponent();

  const { error: deleteError } = await supabase
    .from("project_categories")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) {
    console.error("Error deleting project categories:", deleteError);
    throw new Error("Failed to delete project categories");
  }

  if (categoryIds.length > 0) {
    const inserts = categoryIds.map((categoryId) => ({
      project_id: projectId,
      category_id: categoryId,
    }));

    const { error: insertError } = await supabase
      .from("project_categories")
      .insert(inserts);

    if (insertError) {
      console.error("Error inserting project categories:", insertError);
      throw new Error("Failed to insert project categories");
    }
  }

  return { success: true };
};

export async function getAllProjects(kanbanBoardId?: string) {
  const supabase = await createClientServerComponent();

  try {
    let query = supabase
      .from("kanban_boards")
      .select("id, name, project_id, projects (id, name, main_image)")
      .eq("projects.kanban_display", true);

    if (kanbanBoardId) {
      query = query.eq("id", kanbanBoardId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const flattenedProjects = data.map((item: any) => ({
      ...item.projects,
      kanban_board_id: item.id,
      kanban_board_name: item.name,
    }));

    return flattenedProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch projects",
    };
  }
}

/**
 * Get project by ID with full details including project_members.
 *
 * ─── PATCH (CBP-95) ──────────────────────────────────────────────────────────
 * Added display_position and email_address to the codev sub-select inside
 * project_members for team leader fallback construction in ProjectEditModal.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * ─── PATCH (CBP-116) ─────────────────────────────────────────────────────────
 * Switched project_members codev data to a two-query approach, mirroring
 * getMembers(). The PostgREST foreign key join applies RLS on the codev table
 * which silently drops members whose codev rows are filtered (e.g. Raineer).
 * Two-query approach: fetch codev_ids from project_members, then fetch codev
 * records via .in("id", codevIds) — this bypasses the join RLS issue.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export async function getProjectByID(id: string) {
  const supabase = await createClientServerComponent();

  // Step 1: fetch project row + categories (no codev join here)
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        *,
        project_members (
          id,
          codev_id,
          role,
          joined_at
        ),
        categories:project_categories(
          projects_category(
            id,
            name,
            description
          )
        )
      `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) return null;

  // Step 2: fetch codev records separately to bypass join RLS filtering
  const codevIds = (data.project_members ?? []).map((pm: any) => pm.codev_id);

  let codevMap: Map<string, any> = new Map();

  if (codevIds.length > 0) {
    const { data: codevs, error: codevError } = await supabase
      .from("codev")
      .select("id, first_name, last_name, image_url, display_position, email_address")
      .in("id", codevIds);

    if (codevError) {
      console.error("Error fetching codev records for project members:", codevError);
    } else {
      codevs?.forEach((c: any) => codevMap.set(c.id, c));
    }
  }

  // Step 3: merge codev data back into project_members
  const projectMembersWithCodev = (data.project_members ?? []).map((pm: any) => ({
    ...pm,
    codev: codevMap.get(pm.codev_id) ?? null,
  }));

  return {
    ...data,
    project_members: projectMembersWithCodev,
    categories: data.categories?.map((cat: any) => cat.projects_category).filter(Boolean) || [],
  };
}