import { createClientServerComponent } from "@/utils/supabase/server";

export const ATTENDANCE_POINTS_PER_DAY = 2;

interface AttendanceRecord {
  id?: string;
  codev_id: string;
  project_id: string;
  date: string;
  status: "present" | "absent" | "late" | "holiday" | "weekend";
  check_in?: string;
  check_out?: string;
  created_at?: string;
  updated_at?: string;
}

export async function saveAttendanceRecord(record: AttendanceRecord) {
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

    // The database trigger will automatically handle points calculation

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error in saveAttendanceRecord:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getAttendanceForMonth(
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

export async function getAllCodevPoints(codevId: string) {
  const supabase = await createClientServerComponent();
  
  // Get skill points
  const { data: skillPoints, error: skillError } = await supabase
    .from("codev_points")
    .select("*, skill_category(*)")
    .eq("codev_id", codevId);

  if (skillError) {
    console.error("Error fetching skill points:", skillError);
  }

  // Get attendance points
  const { data: attendanceData, error: attendanceError } = await supabase
    .from("attendance_points")
    .select("*")
    .eq("codev_id", codevId)
    .single();

  if (attendanceError && attendanceError.code !== 'PGRST116') {
    console.error("Error fetching attendance points:", attendanceError);
  }

  // Calculate totals
  const totalSkillPoints = skillPoints?.reduce((sum, record) => sum + (record.points || 0), 0) || 0;
  const attendancePoints = attendanceData?.points || 0;
  const totalPoints = totalSkillPoints + attendancePoints;

  return { 
    success: true,
    skillPoints: skillPoints || [],
    attendancePoints,
    totalSkillPoints,
    totalPoints
  };
}