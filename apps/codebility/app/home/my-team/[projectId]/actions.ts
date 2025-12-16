"use server";

import { revalidatePath } from "next/cache";
import { createClientServerComponent } from "@/utils/supabase/server";

const ATTENDANCE_POINTS_PER_DAY = 2;

/**
 * Recalculate attendance points from scratch with comprehensive error handling
 * 
 * WHY: Ensures points match actual attendance records, prevents duplicate point awards
 * FIXED: Uses maybeSingle() instead of single() to handle missing records gracefully
 * 
 * @param codevId - The codev UUID to recalculate points for
 */
async function recalculateAttendancePoints(codevId: string) {
  const supabase = await createClientServerComponent();

  try {
    console.log(`[SYNC START] Processing codev_id: ${codevId}`);
    
    // Verify codev exists first to prevent invalid operations
    const { data: codevExists, error: codevError } = await supabase
      .from("codev")
      .select("id")
      .eq("id", codevId)
      .single();

    if (codevError || !codevExists) {
      console.error(`[SYNC ERROR] Invalid codev_id: ${codevId}`, codevError);
      return;
    }

    // Count all attendance records that should earn points
    const { count, error: countError } = await supabase
      .from("attendance")
      .select("*", { count: 'exact', head: true })
      .eq("codev_id", codevId)
      .in("status", ["present", "late", "excused"]);

    if (countError) {
      console.error("[SYNC ERROR] Count failed:", countError);
      return;
    }

    // Calculate correct total points based on attendance count
    const correctPoints = (count || 0) * ATTENDANCE_POINTS_PER_DAY;
    console.log(`[SYNC] ${count} records = ${correctPoints} points`);

    // Check if points record exists - using maybeSingle() to handle null gracefully
    const { data: existing, error: fetchError } = await supabase
      .from("attendance_points")
      .select("*")
      .eq("codev_id", codevId)
      .maybeSingle();

    if (fetchError) {
      console.error("[SYNC ERROR] Fetch failed:", fetchError);
      return;
    }

    if (existing) {
      // Update existing record with correct points
      const { error: updateError } = await supabase
        .from("attendance_points")
        .update({
          points: correctPoints,
          last_updated: new Date().toISOString().split('T')[0]
        })
        .eq("codev_id", codevId);

      if (updateError) {
        console.error("[SYNC ERROR] Update failed:", updateError);
        return;
      }
      console.log(`[SYNC SUCCESS] Updated ${codevId}: ${correctPoints} pts`);
    } else {
      // Create new record for codev
      const { error: insertError } = await supabase
        .from("attendance_points")
        .insert({
          codev_id: codevId,
          points: correctPoints,
          last_updated: new Date().toISOString().split('T')[0]
        });

      if (insertError) {
        console.error("[SYNC ERROR] Insert failed:", insertError);
        return;
      }
      console.log(`[SYNC SUCCESS] Created ${codevId}: ${correctPoints} pts`);
    }
  } catch (error) {
    console.error("[SYNC ERROR] Unexpected:", error);
  }
}

/**
 * Save single attendance record with automatic point recalculation
 * 
 * PROCESS:
 * 1. Validate date format
 * 2. Check if record exists (upsert pattern)
 * 3. Save attendance record
 * 4. Recalculate total points from scratch
 * 5. Create notification if present
 * 
 * FIXED: Explicitly set created_at and updated_at to satisfy RLS policies
 * 
 * @returns {success: boolean, data?: object, error?: string}
 */
export async function saveAttendance(record: {
  id?: string;
  codev_id: string;
  project_id: string;
  date: string;
  status: "present" | "absent" | "late" | "holiday" | "weekend" | "excused";
  check_in?: string;
  check_out?: string;
  notes?: string;
}) {
  const supabase = await createClientServerComponent();

  try {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(record.date)) {
      console.error("[VALIDATION ERROR] Invalid date format:", record.date);
      return { 
        success: false, 
        error: "Invalid date format. Use YYYY-MM-DD" 
      };
    }

    console.log(`[SAVE START] Date: ${record.date}, Status: ${record.status}, Codev: ${record.codev_id}`);
    
    // Check if this is a past date (allowed for manual corrections)
    const recordDate = new Date(record.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPastDate = recordDate < today;
    
    if (isPastDate) {
      console.log(`[PAST DATE] Saving attendance for past date: ${record.date}`);
    }

    // Check if attendance record exists for this date
    const { data: existing, error: fetchError } = await supabase
      .from("attendance")
      .select("*")
      .eq("codev_id", record.codev_id)
      .eq("project_id", record.project_id)
      .eq("date", record.date)
      .maybeSingle();

    if (fetchError) {
      console.error("[FETCH ERROR] Failed to check existing record:", fetchError);
      return { success: false, error: fetchError.message };
    }

    let result;
    if (existing) {
      // Update existing record
      // CRITICAL: Must explicitly set updated_at for RLS policies
      console.log(`[UPDATE] Updating existing attendance record: ${existing.id}`);
      result = await supabase
        .from("attendance")
        .update({
          status: record.status,
          check_in: record.check_in,
          check_out: record.check_out,
          notes: record.notes,
          updated_at: new Date().toISOString()
        })
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      // Create new record - explicitly allow past dates for manual corrections
      // CRITICAL: Must explicitly set created_at and updated_at for RLS policies
      console.log(`[INSERT] Creating new attendance record for ${record.date}`);
      result = await supabase
        .from("attendance")
        .insert({
          codev_id: record.codev_id,
          project_id: record.project_id,
          date: record.date,
          status: record.status,
          check_in: record.check_in,
          check_out: record.check_out,
          notes: record.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error("[SAVE ERROR] Failed to save attendance:", result.error);
      return { success: false, error: result.error.message };
    }

    console.log(`[SAVE SUCCESS] Attendance saved for ${record.date}`);

    // CRITICAL: Recalculate total points from scratch after every save
    await recalculateAttendancePoints(record.codev_id);

    // Revalidate pages to show updated data
    revalidatePath(`/home/my-team/${record.project_id}`);
    revalidatePath(`/home`);

    // Create notification only for present status
    if (record.status === "present") {
      try {
        const { data: project } = await supabase
          .from("projects")
          .select("name")
          .eq("id", record.project_id)
          .single();

        await supabase.rpc('create_notification', {
          p_recipient_id: record.codev_id,
          p_title: 'Attendance Marked',
          p_message: `Your attendance has been marked as present for ${project?.name || 'your project'}. You earned ${ATTENDANCE_POINTS_PER_DAY} points!`,
          p_type: 'attendance',
          p_priority: 'normal',
          p_metadata: {
            date: record.date,
            status: record.status,
            project_id: record.project_id,
            points_earned: ATTENDANCE_POINTS_PER_DAY
          },
          p_project_id: record.project_id
        });
      } catch (notificationError) {
        console.error("[NOTIFICATION ERROR]", notificationError);
        // Don't fail the entire operation if notification fails
      }
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("[UNEXPECTED ERROR] saveAttendance:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Bulk save attendance records with optimized point recalculation
 * 
 * OPTIMIZATION: Recalculates points once per unique codev instead of per record
 * 
 * @param records - Array of attendance records to save
 * @returns {success: boolean, results: Array, error?: string}
 */
export async function bulkSaveAttendance(records: {
  id?: string;
  codev_id: string;
  project_id: string;
  date: string;
  status: "present" | "absent" | "late" | "holiday" | "weekend" | "excused";
  check_in?: string;
  check_out?: string;
  notes?: string;
}[]) {
  const supabase = await createClientServerComponent();

  try {
    console.log(`[BULK SAVE] Processing ${records.length} records`);

    // Save all records in parallel
    const results = await Promise.all(
      records.map(record => saveAttendance(record))
    );

    // Check for failures
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      console.error(`[BULK ERROR] ${failed.length} records failed:`, failed);
      return {
        success: false,
        error: `Failed to save ${failed.length} records`,
        results
      };
    }

    // OPTIMIZATION: Recalculate points once per unique codev instead of per record
    const uniqueCodevIds = [...new Set(records.map(r => r.codev_id))];
    console.log(`[BULK SYNC] Recalculating points for ${uniqueCodevIds.length} members`);
    
    await Promise.all(
      uniqueCodevIds.map(id => recalculateAttendancePoints(id))
    );

    // Revalidate pages
    if (records.length > 0) {
      revalidatePath(`/home/my-team/${records[0].project_id}`);
      revalidatePath(`/home`);
    }

    console.log(`[BULK SUCCESS] All ${records.length} records saved`);
    return { success: true, results };
  } catch (error) {
    console.error("[BULK ERROR] Unexpected:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Manual sync function to fix all incorrect attendance points
 * 
 * USE CASE: Run this once to correct all attendance points after migration or bug fixes
 * 
 * @param projectId - Optional: Limit sync to specific project
 * @returns {success: boolean, message?: string, error?: string}
 */
export async function syncAllAttendancePoints(projectId?: string) {
  const supabase = await createClientServerComponent();

  try {
    console.log(`[MASS SYNC START]${projectId ? ` Project: ${projectId}` : ' All projects'}`);

    // Get all unique codev IDs that have attendance records
    let query = supabase
      .from("attendance")
      .select("codev_id");

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    const { data: records, error } = await query;

    if (error) {
      console.error("[MASS SYNC ERROR] Failed to fetch records:", error);
      return { success: false, error: error.message };
    }

    // Get unique codev IDs
    const uniqueCodevIds = [...new Set(records?.map(r => r.codev_id) || [])];
    
    console.log(`[MASS SYNC] Recalculating points for ${uniqueCodevIds.length} members`);

    // Recalculate points for each member in parallel
    await Promise.all(
      uniqueCodevIds.map(id => recalculateAttendancePoints(id))
    );

    console.log(`[MASS SYNC SUCCESS] ${uniqueCodevIds.length} members processed`);
    return { 
      success: true, 
      message: `Successfully synced ${uniqueCodevIds.length} members` 
    };
  } catch (error) {
    console.error("[MASS SYNC ERROR] Unexpected:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get monthly attendance records for a project
 * 
 * @param projectId - Project UUID
 * @param year - Full year (e.g., 2024)
 * @param month - Month index (0-11)
 * @returns {success: boolean, data: Array, error?: string}
 */
export async function getMonthlyAttendance(
  projectId: string,
  year: number,
  month: number
) {
  const supabase = await createClientServerComponent();

  try {
    // Calculate date range for the month
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    console.log(`[FETCH] Monthly attendance: ${startDate} to ${endDate}`);

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("project_id", projectId)
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) {
      console.error("[FETCH ERROR] Monthly attendance:", error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("[FETCH ERROR] Unexpected:", error);
    return { success: false, error: "An unexpected error occurred", data: [] };
  }
}

/**
 * Get attendance points for a specific codev
 * 
 * @param codevId - Codev UUID
 * @returns {success: boolean, points: number, lastUpdated?: string}
 */
export async function getCodevAttendancePoints(codevId: string) {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = await supabase
      .from("attendance_points")
      .select("*")
      .eq("codev_id", codevId)
      .maybeSingle();

    if (error) {
      console.error("[FETCH ERROR] Attendance points:", error);
      return { success: false, error: error.message, points: 0 };
    }

    return {
      success: true,
      points: data?.points || 0,
      lastUpdated: data?.last_updated
    };
  } catch (error) {
    console.error("[FETCH ERROR] Unexpected:", error);
    return { success: false, error: "An unexpected error occurred", points: 0 };
  }
}

/**
 * Save meeting schedule for a project
 * 
 * @param projectId - Project UUID
 * @param schedule - Schedule object with selectedDays and time
 * @returns {success: boolean, data?: object, error?: string}
 */
export async function saveMeetingSchedule(
  projectId: string,
  schedule: {
    selectedDays: string[];
    time: string;
  }
) {
  const supabase = await createClientServerComponent();

  try {
    console.log(`[SCHEDULE SAVE] Project: ${projectId}`, schedule);

    const { data, error } = await supabase
      .from("projects")
      .update({
        meeting_schedule: schedule
      })
      .eq("id", projectId)
      .select()
      .single();

    if (error) {
      console.error("[SCHEDULE ERROR] Save failed:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/home/my-team/${projectId}`);
    
    console.log(`[SCHEDULE SUCCESS] Saved for project ${projectId}`);
    return { success: true, data };
  } catch (error) {
    console.error("[SCHEDULE ERROR] Unexpected:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get meeting schedule for a project
 * 
 * @param projectId - Project UUID
 * @returns {success: boolean, schedule?: object, error?: string}
 */
export async function getMeetingSchedule(projectId: string) {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, meeting_schedule")
      .eq("id", projectId)
      .maybeSingle();

    if (error) {
      console.error("[SCHEDULE ERROR] Fetch failed:", error);
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      schedule: data?.meeting_schedule || null
    };
  } catch (error) {
    console.error("[SCHEDULE ERROR] Unexpected:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get team monthly attendance points aggregated by member
 * 
 * @param projectId - Project UUID
 * @param year - Full year (e.g., 2024)
 * @param month - Month index (0-11)
 * @returns Aggregated points and attendance stats
 */
export async function getTeamMonthlyAttendancePoints(
  projectId: string,
  year: number,
  month: number
) {
  const supabase = await createClientServerComponent();

  try {
    // Calculate date range
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    console.log(`[TEAM STATS] Fetching for ${startDate} to ${endDate}`);

    const { data, error } = await supabase
      .from("attendance")
      .select("codev_id, status")
      .eq("project_id", projectId)
      .gte("date", startDate)
      .lte("date", endDate)
      .in("status", ["present", "late", "excused"]);

    if (error) {
      console.error("[TEAM STATS ERROR]", error);
      return { 
        success: false, 
        error: error.message, 
        totalPoints: 0, 
        presentDays: 0 
      };
    }

    // Calculate total points earned by all members
    const totalPoints = (data?.length || 0) * ATTENDANCE_POINTS_PER_DAY;

    // Count present days per member
    const counts: Record<string, number> = {};
    (data || []).forEach(record => {
      counts[record.codev_id] = (counts[record.codev_id] || 0) + 1;
    });

    const uniqueCodevIdsPresentDays = Object.keys(counts).map(codevId => ({
      codevId,
      presentDays: counts[codevId]
    }));

    return {
      success: true,
      totalPoints,
      presentDays: data?.length || 0,
      uniqueMembers: new Set(data?.map(record => record.codev_id)).size,
      uniqueCodevIdsPresentDays
    };
  } catch (error) {
    console.error("[TEAM STATS ERROR] Unexpected:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred", 
      totalPoints: 0, 
      presentDays: 0 
    };
  }
}