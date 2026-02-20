"use server";

import { revalidatePath } from "next/cache";
import { createClientServerComponent } from "@/utils/supabase/server";

const ATTENDANCE_POINTS_PER_DAY = 2;

// ─── INTERNAL: Core save logic only — no point recalc (trigger handles it) ───
async function saveAttendanceRecord(
  supabase: Awaited<ReturnType<typeof createClientServerComponent>>,
  record: {
    codev_id: string;
    project_id: string;
    date: string;
    status: "present" | "absent" | "late" | "holiday" | "weekend" | "excused";
    check_in?: string;
    check_out?: string;
    notes?: string;
  }
): Promise<{ success: boolean; data?: object; error?: string }> {
  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(record.date)) {
    return { success: false, error: "Invalid date format. Use YYYY-MM-DD" };
  }

  // Check for existing record (unique constraint: codev_id + project_id + date)
  const { data: existing, error: fetchError } = await supabase
    .from("attendance")
    .select("id")
    .eq("codev_id", record.codev_id)
    .eq("project_id", record.project_id)
    .eq("date", record.date)
    .maybeSingle();

  if (fetchError) {
    console.error("[FETCH ERROR]", fetchError);
    return { success: false, error: fetchError.message };
  }

  let result;

  if (existing) {
    console.log(`[UPDATE] Updating record: ${existing.id}`);
    result = await supabase
      .from("attendance")
      .update({
        status: record.status,
        check_in: record.check_in ?? null,
        check_out: record.check_out ?? null,
        notes: record.notes ?? null,
        // ✅ DO NOT send updated_at — the update_attendance_updated_at
        //    trigger sets it automatically via update_updated_at_column()
      })
      .eq("id", existing.id)
      .select()
      .single();
  } else {
    console.log(`[INSERT] Creating record for ${record.date}`);
    result = await supabase
      .from("attendance")
      .insert({
        codev_id: record.codev_id,
        project_id: record.project_id,
        date: record.date,
        status: record.status,
        check_in: record.check_in ?? null,
        check_out: record.check_out ?? null,
        notes: record.notes ?? null,
        // ✅ DO NOT send created_at / updated_at — both default to now()
        //    in the schema and are managed by triggers
      })
      .select()
      .single();
  }

  if (result.error) {
    console.error("[SAVE ERROR]", result.error);
    return { success: false, error: result.error.message };
  }

  console.log(`[SAVE SUCCESS] ${existing ? "Updated" : "Created"} record for ${record.date}`);
  return { success: true, data: result.data };
}

// ─── PUBLIC: Save single attendance record ────────────────────────────────────
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
    const result = await saveAttendanceRecord(supabase, record);
    if (!result.success) return result;

    // ✅ NO manual recalculateAttendancePoints() call needed —
    //    update_attendance_points_trigger fires automatically on
    //    INSERT/UPDATE/DELETE and calls update_attendance_points_on_attendance_change()

    revalidatePath(`/home/my-team/${record.project_id}`);
    revalidatePath(`/home`);

    // Send notification for present status only
    if (record.status === "present") {
      try {
        const { data: project } = await supabase
          .from("projects")
          .select("name")
          .eq("id", record.project_id)
          .single();

        await supabase.rpc("create_notification", {
          p_recipient_id: record.codev_id,
          p_title: "Attendance Marked",
          p_message: `Your attendance has been marked as present for ${
            project?.name || "your project"
          }. You earned ${ATTENDANCE_POINTS_PER_DAY} points!`,
          p_type: "attendance",
          p_priority: "normal",
          p_metadata: {
            date: record.date,
            status: record.status,
            project_id: record.project_id,
            points_earned: ATTENDANCE_POINTS_PER_DAY,
          },
          p_project_id: record.project_id,
        });
      } catch (notificationError) {
        // Notification failure should never block attendance saving
        console.error("[NOTIFICATION ERROR]", notificationError);
      }
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("[UNEXPECTED ERROR] saveAttendance:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ─── PUBLIC: Bulk save attendance records ─────────────────────────────────────
export async function bulkSaveAttendance(
  records: {
    id?: string;
    codev_id: string;
    project_id: string;
    date: string;
    status: "present" | "absent" | "late" | "holiday" | "weekend" | "excused";
    check_in?: string;
    check_out?: string;
    notes?: string;
  }[]
) {
  const supabase = await createClientServerComponent();

  try {
    console.log(`[BULK SAVE] Processing ${records.length} records`);

    // ✅ Use saveAttendanceRecord (not saveAttendance) to avoid:
    //    1. Redundant revalidatePath calls per record
    //    2. The old recalculateAttendancePoints race condition
    //    The DB trigger handles points for every row automatically
    const results = await Promise.all(
      records.map((record) => saveAttendanceRecord(supabase, record))
    );

    const failed = results.filter((r) => !r.success);
    if (failed.length > 0) {
      console.error(`[BULK ERROR] ${failed.length} records failed:`, failed);
      return {
        success: false,
        error: `Failed to save ${failed.length} records`,
        results,
      };
    }

    if (records.length > 0 && records[0]?.project_id) {
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

// ─── Manual sync — only needed as a one-time repair tool ─────────────────────
// If attendance_points ever drifts out of sync (e.g. after a migration),
// run this once. Normal operation doesn't need it — the trigger handles everything.
export async function syncAllAttendancePoints(projectId?: string) {
  const supabase = await createClientServerComponent();

  try {
    console.log(`[MASS SYNC START]${projectId ? ` Project: ${projectId}` : " All projects"}`);

    let query = supabase.from("attendance").select("codev_id");
    if (projectId) query = query.eq("project_id", projectId);

    const { data: records, error } = await query;
    if (error) return { success: false, error: error.message };

    const uniqueCodevIds = [...new Set(records?.map((r) => r.codev_id) || [])];

    // Recalculate by re-counting directly (trigger won't fire on no-op updates,
    // so we upsert into attendance_points directly here as a repair operation)
    await Promise.all(
      uniqueCodevIds.map(async (codevId) => {
        const { count } = await supabase
          .from("attendance")
          .select("*", { count: "exact", head: true })
          .eq("codev_id", codevId)
          .in("status", ["present", "late", "excused"]);

        const correctPoints = (count || 0) * ATTENDANCE_POINTS_PER_DAY;

        await supabase
          .from("attendance_points")
          .upsert(
            {
              codev_id: codevId,
              points: correctPoints,
              last_updated: new Date().toISOString().split("T")[0],
            },
            { onConflict: "codev_id" }  // unique constraint on codev_id
          );
      })
    );

    console.log(`[MASS SYNC SUCCESS] ${uniqueCodevIds.length} members processed`);
    return {
      success: true,
      message: `Successfully synced ${uniqueCodevIds.length} members`,
    };
  } catch (error) {
    console.error("[MASS SYNC ERROR] Unexpected:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ─── Read-only helpers (unchanged) ───────────────────────────────────────────
export async function getMonthlyAttendance(
  projectId: string,
  year: number,
  month: number
) {
  const supabase = await createClientServerComponent();
  try {
    const startDate = new Date(year, month, 1).toISOString().split("T")[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("project_id", projectId)
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) return { success: false, error: error.message, data: [] };
    return { success: true, data: data || [] };
  } catch {
    return { success: false, error: "An unexpected error occurred", data: [] };
  }
}

export async function getCodevAttendancePoints(codevId: string) {
  const supabase = await createClientServerComponent();
  try {
    const { data, error } = await supabase
      .from("attendance_points")
      .select("*")
      .eq("codev_id", codevId)
      .maybeSingle();

    if (error) return { success: false, error: error.message, points: 0 };
    return {
      success: true,
      points: data?.points || 0,
      lastUpdated: data?.last_updated,
    };
  } catch {
    return { success: false, error: "An unexpected error occurred", points: 0 };
  }
}

export async function saveMeetingSchedule(
  projectId: string,
  schedule: { selectedDays: string[]; time: string; meetingLink?: string }
) {
  const supabase = await createClientServerComponent();
  try {
    const { data, error } = await supabase
      .from("projects")
      .update({
        meeting_schedule: {
          selectedDays: schedule.selectedDays,
          time: schedule.time,
        },
        meeting_link: schedule.meetingLink || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    revalidatePath(`/home/my-team/${projectId}`);
    return { success: true, data };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getMeetingSchedule(projectId: string) {
  const supabase = await createClientServerComponent();
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("id, name, meeting_schedule, meeting_link")
      .eq("id", projectId)
      .maybeSingle();

    if (error) return { success: false, error: error.message };

    const schedule = data?.meeting_schedule
      ? {
          selectedDays: data.meeting_schedule.selectedDays || [],
          time: data.meeting_schedule.time || "00:00",
          meetingLink: data.meeting_link || "",
        }
      : null;

    return { success: true, schedule };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function createMeeting(meetingData: {
  project_id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes?: number;
  location?: string;
  meeting_link?: string;
  created_by: string;
}) {
  const supabase = await createClientServerComponent();
  try {
    const { data, error } = await supabase
      .from("meetings")
      .insert({ ...meetingData })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    revalidatePath(`/home/my-team/${meetingData.project_id}`);
    return { success: true, data };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function sendMeetingNotification(
  projectId: string,
  meetingDetails: {
    date: string;
    time: string;
    title?: string;
    description?: string;
    location?: string;
    meetingLink?: string;
  }
) {
  const supabase = await createClientServerComponent();
  try {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("name")
      .eq("id", projectId)
      .single();

    if (projectError || !project)
      return { success: false, error: "Project not found", sent: 0, failed: 0 };

    const { data: members, error: membersError } = await supabase
      .from("codev")
      .select("id, user_id")
      .eq("project_id", projectId);

    if (membersError)
      return {
        success: false,
        error: "Failed to fetch team members",
        sent: 0,
        failed: 0,
      };

    if (!members || members.length === 0)
      return { success: true, message: "No members to notify", sent: 0, failed: 0 };

    const title = meetingDetails.title || "Team Meeting Scheduled";
    const meetingDate = new Date(meetingDetails.date).toLocaleDateString(
      "en-US",
      { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    );

    let message = `A meeting has been scheduled for ${project.name} on ${meetingDate} at ${meetingDetails.time}.`;
    if (meetingDetails.description)
      message += `\n\nDetails: ${meetingDetails.description}`;
    if (meetingDetails.location)
      message += `\n\nLocation: ${meetingDetails.location}`;
    if (meetingDetails.meetingLink)
      message += `\n\nJoin Meeting: ${meetingDetails.meetingLink}`;

    const results = await Promise.all(
      members.map(async (member) => {
        try {
          const { error } = await supabase.rpc("create_notification", {
            p_recipient_id: member.id,
            p_title: title,
            p_message: message,
            p_type: "meeting",
            p_priority: "high",
            p_metadata: {
              project_id: projectId,
              meeting_date: meetingDetails.date,
              meeting_time: meetingDetails.time,
              location: meetingDetails.location,
              description: meetingDetails.description,
              meeting_link: meetingDetails.meetingLink,
            },
            p_project_id: projectId,
          });
          return { success: !error, memberId: member.id };
        } catch {
          return { success: false, memberId: member.id };
        }
      })
    );

    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return {
      success: true,
      sent,
      failed,
      message: `Notifications sent to ${sent} member(s)${failed > 0 ? `, ${failed} failed` : ""}`,
    };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred",
      sent: 0,
      failed: 0,
    };
  }
}

export async function getTeamMonthlyAttendancePoints(
  projectId: string,
  year: number,
  month: number
) {
  const supabase = await createClientServerComponent();
  try {
    const startDate = new Date(year, month, 1).toISOString().split("T")[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("attendance")
      .select("codev_id, status")
      .eq("project_id", projectId)
      .gte("date", startDate)
      .lte("date", endDate)
      .in("status", ["present", "late", "excused"]);

    if (error)
      return { success: false, error: error.message, totalPoints: 0, presentDays: 0 };

    const totalPoints = (data?.length || 0) * ATTENDANCE_POINTS_PER_DAY;
    const counts: Record<string, number> = {};
    (data || []).forEach((record) => {
      counts[record.codev_id] = (counts[record.codev_id] || 0) + 1;
    });

    return {
      success: true,
      totalPoints,
      presentDays: data?.length || 0,
      uniqueMembers: new Set((data || []).map((r) => r.codev_id)).size,
      uniqueCodevIdsPresentDays: Object.keys(counts).map((codevId) => ({
        codevId,
        presentDays: counts[codevId],
      })),
    };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred",
      totalPoints: 0,
      presentDays: 0,
    };
  }
}