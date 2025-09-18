"use server";

import { revalidatePath } from "next/cache";
import { createClientServerComponent } from "@/utils/supabase/server";

// Constants cannot be exported from "use server" files
const ATTENDANCE_POINTS_PER_DAY = 2;

async function updateAttendancePoints(codevId: string, pointsDelta: number) {
  const supabase = await createClientServerComponent();
  
  try {
    // Check if attendance points record exists
    const { data: existing } = await supabase
      .from("attendance_points")
      .select("*")
      .eq("codev_id", codevId)
      .single();

    if (existing) {
      // Update existing record
      const newPoints = Math.max(0, existing.points + pointsDelta);
      await supabase
        .from("attendance_points")
        .update({
          points: newPoints,
          last_updated: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq("codev_id", codevId);
    } else if (pointsDelta > 0) {
      // Create new record only if adding points
      await supabase
        .from("attendance_points")
        .insert({
          codev_id: codevId,
          points: pointsDelta,
          last_updated: new Date().toISOString().split('T')[0]
        });
    }
  } catch (error) {
    console.error("Error updating attendance points:", error);
  }
}

interface AttendanceRecord {
  id?: string;
  codev_id: string;
  project_id: string;
  date: string;
  status: "present" | "absent" | "late" | "holiday" | "weekend";
  check_in?: string;
  check_out?: string;
  notes?: string;
}

export async function saveAttendance(record: AttendanceRecord) {
  const supabase = await createClientServerComponent();
  
  try {
    // Check if attendance record exists for this date
    const { data: existing } = await supabase
      .from("attendance")
      .select("*")
      .eq("codev_id", record.codev_id)
      .eq("project_id", record.project_id)
      .eq("date", record.date)
      .single();

    let result;
    if (existing) {
      // Update existing record
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
      // Create new record
      result = await supabase
        .from("attendance")
        .insert(record)
        .select()
        .single();
    }

    if (result.error) {
      console.error("Error saving attendance:", result.error);
      return { success: false, error: result.error.message };
    }

    // Manually update attendance points (in case trigger isn't working)
    if (record.status === "present" || record.status === "late") {
      await updateAttendancePoints(record.codev_id, 2);
    } else if (existing && (existing.status === "present" || existing.status === "late") && 
               record.status !== "present" && record.status !== "late") {
      // Deduct points if changing from present/late to absent
      await updateAttendancePoints(record.codev_id, -2);
    }

    revalidatePath(`/home/my-team/${record.project_id}`);
    revalidatePath(`/home`);
    
    // Create notification for attendance update (only for present status)
    if (record.status === "present") {
      try {
        const supabase = await createClientServerComponent();
        
        // Get project name for notification
        const { data: project } = await supabase
          .from("projects")
          .select("name")
          .eq("id", record.project_id)
          .single();
        
        // Create notification using raw SQL to bypass triggers
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
        // Don't fail the attendance save if notification fails
        console.error("Error creating attendance notification:", notificationError);
      }
    }
    
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error in saveAttendance:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getMonthlyAttendance(
  projectId: string,
  year: number,
  month: number
) {
  const supabase = await createClientServerComponent();
  
  // Create date range for the month
  const startDate = new Date(year, month, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("project_id", projectId)
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) {
    console.error("Error fetching attendance:", error);
    return { success: false, error: error.message, data: [] };
  }

  return { success: true, data: data || [] };
}

export async function getCodevAttendancePoints(codevId: string) {
  const supabase = await createClientServerComponent();
  
  const { data, error } = await supabase
    .from("attendance_points")
    .select("*")
    .eq("codev_id", codevId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error("Error fetching attendance points:", error);
    return { success: false, error: error.message, points: 0 };
  }

  return { 
    success: true, 
    points: data?.points || 0,
    lastUpdated: data?.last_updated
  };
}

export async function bulkSaveAttendance(records: AttendanceRecord[]) {
  const supabase = await createClientServerComponent();
  
  try {
    const results = await Promise.all(
      records.map(record => saveAttendance(record))
    );
    
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      console.error("Some attendance records failed to save:", failed);
      return { 
        success: false, 
        error: `Failed to save ${failed.length} records`,
        results 
      };
    }
    
    if (records.length > 0) {
      revalidatePath(`/home/my-team/${records[0].project_id}`);
      revalidatePath(`/home`);
      
      // Also sync attendance points for all unique codevs
      const uniqueCodevIds = [...new Set(records.map(r => r.codev_id))];
      await Promise.all(uniqueCodevIds.map(id => syncAttendancePointsTotal(id)));
    }
    
    return { success: true, results };
  } catch (error) {
    console.error("Error in bulkSaveAttendance:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

async function syncAttendancePointsTotal(codevId: string) {
  const supabase = await createClientServerComponent();
  
  try {
    // Count all present/late attendance records
    const { count, error: countError } = await supabase
      .from("attendance")
      .select("*", { count: 'exact', head: true })
      .eq("codev_id", codevId)
      .in("status", ["present", "late"]);
    
    if (countError) {
      console.error("Error counting attendance:", countError);
    }
    
    const totalPoints = (count || 0) * ATTENDANCE_POINTS_PER_DAY;
    
    // Update attendance points
    const { data: existing } = await supabase
      .from("attendance_points")
      .select("*")
      .eq("codev_id", codevId)
      .single();
    
    if (existing) {
      await supabase
        .from("attendance_points")
        .update({
          points: totalPoints,
          last_updated: new Date().toISOString().split('T')[0]
        })
        .eq("codev_id", codevId);
    } else {
      await supabase
        .from("attendance_points")
        .insert({
          codev_id: codevId,
          points: totalPoints,
          last_updated: new Date().toISOString().split('T')[0]
        });
    }
  } catch (error) {
    console.error("Error syncing attendance points total:", error);
  }
}

export async function saveMeetingSchedule(
  projectId: string,
  schedule: {
    selectedDays: string[];
    time: string;
  }
) {
  const supabase = await createClientServerComponent();
  
  try {
    // Save meeting schedule to project metadata or a dedicated table
    const { data, error } = await supabase
      .from("projects")
      .update({
        meeting_schedule: schedule
      })
      .eq("id", projectId)
      .select()
      .single();
    
    if (error) {
      console.error("Error saving meeting schedule:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath(`/home/my-team/${projectId}`);
    
    return { success: true, data };
  } catch (error) {
    console.error("Error in saveMeetingSchedule:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getMeetingSchedule(projectId: string) {
  const supabase = await createClientServerComponent();
  
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, meeting_schedule")
      .eq("id", projectId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching meeting schedule:", error);
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      schedule: data?.meeting_schedule || null
    };
  } catch (error) {
    console.error("Error in getMeetingSchedule:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}