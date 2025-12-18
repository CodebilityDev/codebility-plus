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
    // Get the current logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Error fetching user:", userError);
      return { error: { message: "User not authenticated" }, data: null };
    }

    // Fetch the user's codev_id based on their email
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

    // Define the shape of the project data returned by Supabase
    interface DbProject {
      id: string;
      name: string;
      status: string | null;
      kanban_display: boolean | null; // Add kanban_display to match Project type
    }

    interface ProjectMember {
      project_id: string;
      role: string;
      project: DbProject;
    }

    // Fetch projects where the user is either a team leader or member
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
          kanban_display
        )
      `,
      )
      .eq("codev_id", userCodevId)
      .in("role", ["team_leader", "member"]) as { data: ProjectMember[] | null; error: any };

    if (projectMembersError) {
      console.error("Error fetching user projects:", projectMembersError);
      return { error: { message: "Failed to fetch user projects" }, data: null };
    }

    if (!projectMembers || projectMembers.length === 0) {
      return { error: null, data: null };
    }

    // Map the project members to the expected return type
    const userProjects = projectMembers.map((pm) => ({
      project: {
        id: pm.project.id,
        name: pm.project.name,
        status: pm.project.status || "pending", // Default status if null
        kanban_display: pm.project.kanban_display ?? false, // Default value if null
      } as Project, // Cast to Project type with defaults
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
    // Parse tech stack if provided
    const techStackData = formData.get("tech_stack");
    let techStack: string[] | null = null;
    if (techStackData) {
      try {
        techStack = JSON.parse(techStackData as string) as string[];
      } catch (error) {
        console.warn("Invalid tech stack data:", error);
      }
    }

    // Parse category IDs if provided
    const categoryIdsData = formData.get("category_ids");
    let categoryIds: number[] = [];
    if (categoryIdsData) {
      try {
        categoryIds = JSON.parse(categoryIdsData as string) as number[];
      } catch (error) {
        console.warn("Invalid category IDs data:", error);
      }
    }

    // Parse key_features and gallery if provided
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

    // Create project (removed project_category_id as it no longer exists)
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

    // Insert project categories into junction table
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
        // Don't throw - allow project creation to succeed even if categories fail
      }
    }

    // Create project members including team leader
    const memberInserts = [
      // Add team leader
      {
        project_id: project.id,
        codev_id: teamLeaderId,
        role: "team_leader",
        joined_at: new Date().toISOString(),
      },
      // Add other members
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

    // Create default kanban board
    const { error: boardError } = await supabase.from("kanban_boards").insert({
      name: `${project.name} Board`,
      project_id: project.id,
      description: `Default board for ${project.name}`,
    });

    if (boardError) throw boardError;

    // Invalidate Redis cache for projects
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

/**
 * DOCU: This function is used to update the projects active switch. <br>
 * This is being called on ProjectCard. <br>
 * Last Updated Date: April 17, 2025 <br>
 * @function
 * @param {boolean} activeSwitch
 * @param {string} projectId
 * @author Kas
 */
export async function updateStatus(
  status: string,
  projectId: string,
) {
  const supabase = await createClientServerComponent();
  const { error: projectError } = await supabase
    .from("projects")
    .update({
      status: status,
    })
    .eq("id", projectId)
    .select();

  if (projectError)
    console.error("Error in updating projects and kanban board:", projectError);

  // Invalidate Redis cache for projects
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
    .update({
      kanban_display: kanbanDisplay,
    })
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
    .update({
      public_display: publicDisplay,
    })
    .eq("id", projectId)
    .select();

  if (projectError)
    console.error("Error in updating projects and kanban board:", projectError);

  // Invalidate Redis cache for projects
  await invalidateCache(cacheKeys.projects.all);
  
  // Revalidate both home projects and services pages
  revalidatePath("/home/projects");
  revalidatePath("/services");

  return { success: true, projectId, publicDisplay };
}

export async function updateProject(projectId: string, formData: FormData) {
  const supabase = await createClientServerComponent();

  try {
    // Parse project members data with type assertion
    const projectMembersData = formData.get("project_members");
    const projectMembers = projectMembersData
      ? (JSON.parse(projectMembersData as string) as ProjectMemberData[])
      : null;

    // Parse tech stack if provided
    const techStackData = formData.get("tech_stack");
    let techStack: string[] | null = null;
    if (techStackData) {
      try {
        techStack = JSON.parse(techStackData as string) as string[];
      } catch (error) {
        console.warn("Invalid tech stack data:", error);
      }
    }

    // Parse category IDs if provided
    const categoryIdsData = formData.get("category_ids");
    let categoryIds: number[] | null = null;
    if (categoryIdsData) {
      try {
        categoryIds = JSON.parse(categoryIdsData as string) as number[];
      } catch (error) {
        console.warn("Invalid category IDs data:", error);
      }
    }

    // Parse key_features and gallery if provided
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

    // Update project details
    const updateData: any = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "project_members" && key !== "tech_stack" && key !== "category_ids" && key !== "key_features" && key !== "gallery") {
        // Log the key-value pairs to debug
        console.log(`Processing form field: ${key} = ${value}`);
        updateData[key] = value;
      }
    }
    
    // Add tech stack if provided
    if (techStack) {
      updateData.tech_stack = techStack;
    }

    // Add key_features if provided
    if (keyFeatures) {
      updateData.key_features = keyFeatures;
    }

    // Add gallery if provided
    if (gallery) {
      updateData.gallery = gallery;
    }

    // Log the final update data before sending to Supabase
    console.log("Final update data:", JSON.stringify(updateData, null, 2));

    // Make sure main_image is included in the update if it exists
    if (updateData.main_image) {
      console.log("Updating main_image to:", updateData.main_image);
    } else {
      console.log("No main_image found in update data");
    }

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

    // ✅ FIXED: Handle project members with joined_at preservation
    if (projectMembers && Array.isArray(projectMembers)) {
      // Step 1: Fetch existing members to preserve joined_at dates
      const { data: existingMembers, error: membersError } = await supabase
        .from("project_members")
        .select("codev_id, joined_at")
        .eq("project_id", projectId);

      if (membersError) throw membersError;

      // Step 2: Create lookup map for existing timestamps
      const joinedAtMap = new Map(
        existingMembers?.map(m => [m.codev_id, m.joined_at]) ?? []
      );

      // Step 3: Delete existing members
      const { error: deleteError } = await supabase
        .from("project_members")
        .delete()
        .eq("project_id", projectId);

      if (deleteError) throw deleteError;

      // Step 4: Insert updated members with preserved timestamps
      const { error: insertError } = await supabase
        .from("project_members")
        .insert(
          projectMembers.map((member: ProjectMemberData) => ({
            project_id: projectId,
            codev_id: member.codev_id,
            role: member.role,
            // Use existing joined_at if member was already in project, else use current date
            joined_at: joinedAtMap.get(member.codev_id) ?? new Date().toISOString(),
          })),
        );

      if (insertError) throw insertError;
    }

    // Handle project categories update
    if (categoryIds !== null) {
      // Delete existing project categories
      const { error: deleteCategoriesError } = await supabase
        .from("project_categories")
        .delete()
        .eq("project_id", projectId);

      if (deleteCategoriesError) {
        console.error("Error deleting project categories:", deleteCategoriesError);
        // Don't throw - allow project update to succeed even if categories fail
      }

      // Insert new project categories
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
          // Don't throw - allow project update to succeed even if categories fail
        }
      }
    }

    // Log success with the returned project data
    console.log("Project updated successfully:", projectData);

    // Invalidate Redis cache for projects
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
    // Get project data first to handle image deletion
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select()
      .eq("id", projectId)
      .single();

    if (fetchError) throw fetchError;

    // Delete project image if exists
    if (project.main_image) {
      const imagePath = await getImagePath(project.main_image);
      if (imagePath) {
        await deleteImage(imagePath, "projects");
      }
    }

    // Delete project (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (deleteError) throw deleteError;

    // Invalidate Redis cache for projects
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

export const getMembers = async (
  projectId: string,
): Promise<{
  error: any;
  data: SimpleMemberData[] | null;
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
      .eq("role", "member")) as {
        data: ProjectMemberResponse[] | null;
        error: any;
      };

    if (error) {
      console.error("Error fetching members:", error);
      return { error, data: null };
    }

    if (!data) {
      return { error: null, data: null };
    }

    const members = data.map((member) => ({
      id: member.codev.id,
      first_name: member.codev.first_name,
      last_name: member.codev.last_name,
      email_address: member.codev.email_address,
      display_position: member.codev.display_position,
      image_url: member.codev.image_url,
      role: member.role,
      joined_at: member.joined_at,
    }));

    return { error: null, data: members };
  } catch (error) {
    console.error("Unexpected error fetching members:", error);
    return { error, data: null };
  }
};

// ✅ FIXED FUNCTION: Preserves existing joined_at dates when updating members
export const updateProjectMembers = async (
  projectId: string,
  members: Codev[],
  teamLeaderId: string,
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClientServerComponent();

  try {
    // ✅ Step 1: Fetch existing members to preserve joined_at dates
    const { data: existingMembers, error: fetchError } = await supabase
      .from("project_members")
      .select("codev_id, joined_at")
      .eq("project_id", projectId);

    if (fetchError) throw fetchError;

    // ✅ Step 2: Create lookup map for existing timestamps
    const joinedAtMap = new Map(
      existingMembers?.map(m => [m.codev_id, m.joined_at]) ?? []
    );

    // Step 3: Delete old records
    const { error: deleteError } = await supabase
      .from("project_members")
      .delete()
      .eq("project_id", projectId);

    if (deleteError) throw deleteError;

    // ✅ Step 4: Insert with preserved timestamps for existing members
    const memberInserts = members.map((member) => ({
      project_id: projectId,
      codev_id: member.id,
      role: member.id === teamLeaderId ? "team_leader" : "member",
      // Use existing joined_at if member was already in project, else use current date
      joined_at: joinedAtMap.get(member.id) ?? new Date().toISOString(),
    }));

    const { error: insertError } = await supabase
      .from("project_members")
      .insert(memberInserts);

    if (insertError) throw insertError;

    revalidatePath("/projects");
    return { success: true };
  } catch (error) {
    console.error("Error updating project members:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const getProjectCodevs = async (filters = {}): Promise<Codev[]> => {
  const supabase = await createClientServerComponent();

  let query = supabase.from("codev").select(`
    id,
    first_name,
    last_name,
    email_address,
    image_url,
    positions,
    tech_stacks,
    display_position,
    internal_status,
    project_members!codev_id (
      project:project_id (
        id,
        name
      ),
      role,
      joined_at
    )
  `);

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      query = query.eq(key, value);
    }
  });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Codevs:", error);
    throw new Error("Failed to fetch Codevs");
  }

  return (
    data?.map((codev: any) => {
      // Transform projects array
      const projects = (codev.project_members || []).map(
        (pm: DbProjectMember) => {
          const project: Project & { role: string; joined_at: string } = {
            id: pm.project.id,
            name: pm.project.name,
            role: pm.role,
            joined_at: pm.joined_at,
            status: pm.project.status,
            kanban_display: pm.project.kanban_display,
            public_display: pm.project.public_display
          };
          return project;
        },
      );

      // Transform codev data
      return {
        ...codev,
        positions: codev.positions || [],
        tech_stacks: codev.tech_stacks || [],
        projects,
      } as Codev;
    }) || []
  );
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

/**
 * Get all categories for a specific project
 */
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

  // Flatten the structure
  return data?.map((item: any) => item.projects_category).filter(Boolean) || [];
};

/**
 * Add categories to a project
 */
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

/**
 * Remove a category from a project
 */
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

/**
 * Replace all categories for a project
 */
export const replaceProjectCategories = async (
  projectId: string,
  categoryIds: number[]
) => {
  const supabase = await createClientServerComponent();

  // Delete existing categories
  const { error: deleteError } = await supabase
    .from("project_categories")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) {
    console.error("Error deleting project categories:", deleteError);
    throw new Error("Failed to delete project categories");
  }

  // Insert new categories if any
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

// Get all projects with kanban boards display is true
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

    // Flatten project info
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


export async function getProjectByID(id: string) {
  const supabase = await createClientServerComponent();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        *,
        project_members (
          id,
          codev_id,
          role,
          joined_at,
          codev (
            first_name,
            last_name,
            image_url
          )
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

  // Flatten the categories structure for easier consumption
  const projectWithCategories = data ? {
    ...data,
    categories: data.categories?.map((cat: any) => cat.projects_category).filter(Boolean) || [],
  } : null;

  return projectWithCategories;
}