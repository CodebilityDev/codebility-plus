"use server";

import { revalidatePath } from "next/cache";

import { createClientServerComponent } from "@/utils/supabase/server";
import { requireUser } from "@/lib/server/auth-guard";

/**
 * Attendance point writes are restricted to the project's own team.
 *
 * Both entry points used to run with no check at all, so any caller could
 * rewrite attendance points for any codev. `requireUser` establishes the
 * caller; the membership check inside each function scopes them to a project
 * they belong to.
 */
async function assertProjectMember(
  supabase: Awaited<ReturnType<typeof createClientServerComponent>>,
  projectId: string,
  callerId: string,
  roleId: number | null,
) {
  // role_id 1 is admin, consistent with auth-guard.
  if (roleId === 1) return;

  const { data: membership } = await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("codev_id", callerId)
    .maybeSingle();

  if (!membership) {
    throw new Error("Forbidden");
  }
}

export async function syncAttendancePoints(codevId: string) {
  const { user, roleId } = await requireUser();
  const supabase = await createClientServerComponent();

  try {
    // Resolve which project this codev belongs to and confirm the caller is on
    // it, so a member cannot rewrite another team's points.
    const { data: membership } = await supabase
      .from("project_members")
      .select("project_id")
      .eq("codev_id", codevId)
      .limit(1)
      .maybeSingle();

    if (membership?.project_id) {
      await assertProjectMember(supabase, membership.project_id, user.id, roleId);
    } else if (roleId !== 1 && user.id !== codevId) {
      throw new Error("Forbidden");
    }

    // Count all present/late days for this codev. Only the count is used, so
    // ask Postgres for the count and transfer no rows.
    const { count: attendanceCount, error: attendanceError } = await supabase
      .from("attendance")
      .select("id", { count: "exact", head: true })
      .eq("codev_id", codevId)
      .in("status", ["present", "late"]);

    if (attendanceError) {
      console.error("Error fetching attendance records:", attendanceError);
      return { success: false, error: attendanceError.message };
    }

    // Calculate total points (2 points per day)
    const totalPoints = (attendanceCount || 0) * 2;

    // Update or insert attendance points
    const { data: existing } = await supabase
      .from("attendance_points")
      .select("id")
      .eq("codev_id", codevId)
      .single();

    let result;
    if (existing) {
      // Update existing record
      result = await supabase
        .from("attendance_points")
        .update({
          points: totalPoints,
          last_updated: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq("codev_id", codevId)
        .select()
        .single();
    } else {
      // Create new record
      result = await supabase
        .from("attendance_points")
        .insert({
          codev_id: codevId,
          points: totalPoints,
          last_updated: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error("Error updating attendance points:", result.error);
      return { success: false, error: result.error.message };
    }

    revalidatePath("/home/my-team");

    return { 
      success: true, 
      data: result.data,
      attendanceCount: attendanceCount || 0,
      totalPoints 
    };
  } catch (error) {
    console.error("Error in syncAttendancePoints:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function syncAllTeamAttendancePoints(projectId: string) {
  const { user, roleId } = await requireUser();
  const supabase = await createClientServerComponent();

  try {
    await assertProjectMember(supabase, projectId, user.id, roleId);

    // Get all team members for this project
    const { data: members, error: membersError } = await supabase
      .from("project_members")
      .select("codev_id")
      .eq("project_id", projectId);

    if (membersError) {
      console.error("Error fetching project members:", membersError);
      return { success: false, error: membersError.message };
    }

    // Sync points for each member
    const results = await Promise.all(
      (members || []).map(member => syncAttendancePoints(member.codev_id))
    );

    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      return { 
        success: false, 
        error: `Failed to sync ${failed.length} members`,
        results 
      };
    }

    revalidatePath("/home/my-team");
    return { success: true, results };
  } catch (error) {
    console.error("Error in syncAllTeamAttendancePoints:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}