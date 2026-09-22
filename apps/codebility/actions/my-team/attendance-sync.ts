"use server";

import { createClientServerComponent } from "@/utils/supabase/server";

export async function syncAttendancePoints(codevId: string) {
  const supabase = await createClientServerComponent();
  
  try {
    // Count all present/late days for this codev
    const { data: attendanceRecords, error: attendanceError } = await supabase
      .from("attendance")
      .select("*")
      .eq("codev_id", codevId)
      .in("status", ["present", "late"]);

    if (attendanceError) {
      console.error("Error fetching attendance records:", attendanceError);
      return { success: false, error: attendanceError.message };
    }

    // Calculate total points (2 points per day)
    const totalPoints = (attendanceRecords?.length || 0) * 2;

    // Update or insert attendance points
    const { data: existing } = await supabase
      .from("attendance_points")
      .select("*")
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

    return { 
      success: true, 
      data: result.data,
      attendanceCount: attendanceRecords?.length || 0,
      totalPoints 
    };
  } catch (error) {
    console.error("Error in syncAttendancePoints:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function syncAllTeamAttendancePoints(projectId: string) {
  const supabase = await createClientServerComponent();
  
  try {
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

    return { success: true, results };
  } catch (error) {
    console.error("Error in syncAllTeamAttendancePoints:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}