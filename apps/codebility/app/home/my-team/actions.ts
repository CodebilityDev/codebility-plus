"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================================
// CHECKLIST ITEM CRUD OPERATIONS
// ============================================================================

/**
 * Creates a new checklist item for a team member
 * Only team leads can create checklist items
 */
export async function createChecklistItem(formData: FormData) {
  const supabase = await createClientServerComponent();

  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // Get user's codev profile
    const { data: codevProfile, error: codevError } = await supabase
      .from("codev")
      .select("id")
      .eq("email_address", user.email)
      .single();

    if (codevError || !codevProfile) {
      return { success: false, error: "User profile not found" };
    }

    // Extract form data
    const member_id = formData.get("member_id") as string;
    const project_id = formData.get("project_id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const due_date = formData.get("due_date") as string;

    // Validation
    if (!member_id || !project_id || !title?.trim()) {
      return { success: false, error: "Missing required fields" };
    }

    // Verify user is team lead for this project
    const { data: membership, error: membershipError } = await supabase
      .from("project_members")
      .select("role")
      .eq("project_id", project_id)
      .eq("codev_id", codevProfile.id)
      .single();

    if (membershipError || membership?.role !== "team_leader") {
      return { success: false, error: "Only team leads can create checklist items" };
    }

    // Insert checklist item
    const { data, error } = await supabase
      .from("member_checklists")
      .insert({
        member_id,
        project_id,
        created_by: codevProfile.id,
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority || "medium",
        due_date: due_date || null,
        completed: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating checklist item:", error);
      return { success: false, error: "Failed to create checklist item" };
    }

    // Revalidate the page to show new item
    revalidatePath(`/home/my-team/${project_id}`);

    return { success: true, data };
  } catch (error) {
    console.error("Error in createChecklistItem:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Fetches all checklist items for a specific member in a project
 */
export async function getChecklistItems(memberId: string, projectId: string) {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = await supabase
      .from("member_checklists")
      .select(`
        *,
        created_by_profile:codev!member_checklists_created_by_fkey(
          id,
          first_name,
          last_name,
          image_url
        )
      `)
      .eq("member_id", memberId)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching checklist items:", error);
      return { success: false, error: "Failed to fetch checklist items" };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getChecklistItems:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Updates a checklist item (toggle completion or edit details)
 */
export async function updateChecklistItem(
  itemId: string,
  updates: {
    title?: string;
    description?: string;
    priority?: string;
    completed?: boolean;
    due_date?: string;
  }
) {
  const supabase = await createClientServerComponent();

  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // Get user's codev profile
    const { data: codevProfile, error: codevError } = await supabase
      .from("codev")
      .select("id")
      .eq("email_address", user.email)
      .single();

    if (codevError || !codevProfile) {
      return { success: false, error: "User profile not found" };
    }

    // Get the checklist item to verify permissions
    const { data: item, error: itemError } = await supabase
      .from("member_checklists")
      .select("*, project_id, member_id")
      .eq("id", itemId)
      .single();

    if (itemError || !item) {
      return { success: false, error: "Checklist item not found" };
    }

    // Check if user is team lead or the member who owns the task
    const { data: membership } = await supabase
      .from("project_members")
      .select("role")
      .eq("project_id", item.project_id)
      .eq("codev_id", codevProfile.id)
      .single();

    const isTeamLead = membership?.role === "team_leader";
    const isMemberOwner = item.member_id === codevProfile.id;

    // Members can only toggle completion, team leads can update everything
    if (!isTeamLead && !isMemberOwner) {
      return { success: false, error: "Permission denied" };
    }

    if (!isTeamLead && Object.keys(updates).some(key => key !== "completed")) {
      return { success: false, error: "Members can only update completion status" };
    }

    // Update the checklist item
    const { data, error } = await supabase
      .from("member_checklists")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single();

    if (error) {
      console.error("Error updating checklist item:", error);
      return { success: false, error: "Failed to update checklist item" };
    }

    // Revalidate the page
    revalidatePath(`/home/my-team/${item.project_id}`);

    return { success: true, data };
  } catch (error) {
    console.error("Error in updateChecklistItem:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Deletes a checklist item
 * Only team leads can delete checklist items
 */
export async function deleteChecklistItem(itemId: string) {
  const supabase = await createClientServerComponent();

  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // Get user's codev profile
    const { data: codevProfile, error: codevError } = await supabase
      .from("codev")
      .select("id")
      .eq("email_address", user.email)
      .single();

    if (codevError || !codevProfile) {
      return { success: false, error: "User profile not found" };
    }

    // Get the checklist item to verify permissions
    const { data: item, error: itemError } = await supabase
      .from("member_checklists")
      .select("project_id")
      .eq("id", itemId)
      .single();

    if (itemError || !item) {
      return { success: false, error: "Checklist item not found" };
    }

    // Verify user is team lead
    const { data: membership } = await supabase
      .from("project_members")
      .select("role")
      .eq("project_id", item.project_id)
      .eq("codev_id", codevProfile.id)
      .single();

    if (membership?.role !== "team_leader") {
      return { success: false, error: "Only team leads can delete checklist items" };
    }

    // Delete the checklist item
    const { error } = await supabase
      .from("member_checklists")
      .delete()
      .eq("id", itemId);

    if (error) {
      console.error("Error deleting checklist item:", error);
      return { success: false, error: "Failed to delete checklist item" };
    }

    // Revalidate the page
    revalidatePath(`/home/my-team/${item.project_id}`);

    return { success: true };
  } catch (error) {
    console.error("Error in deleteChecklistItem:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Gets checklist statistics for a member
 */
export async function getChecklistStats(memberId: string, projectId: string) {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = await supabase
      .from("member_checklists")
      .select("completed")
      .eq("member_id", memberId)
      .eq("project_id", projectId);

    if (error) {
      console.error("Error fetching checklist stats:", error);
      return { success: false, error: "Failed to fetch statistics" };
    }

    const total = data.length;
    const completed = data.filter(item => item.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      success: true,
      stats: {
        total,
        completed,
        pending,
        percentage
      }
    };
  } catch (error) {
    console.error("Error in getChecklistStats:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}