"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { createNotification } from "@/lib/server/notification.service";

const ABSENCE_WARNING_THRESHOLD = 3;

// Helper function to check if a date is a scheduled meeting day
function isScheduledMeetingDay(date: Date, meetingSchedule: { selectedDays: string[] } | null): boolean {
  if (!meetingSchedule || !meetingSchedule.selectedDays || meetingSchedule.selectedDays.length === 0) {
    // If no schedule, consider all weekdays as meeting days
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6; // Not Sunday (0) or Saturday (6)
  }
  
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayName = dayNames[date.getDay()];
  return meetingSchedule.selectedDays.includes(dayName);
}

interface AttendanceWarningResult {
  success: boolean;
  warnings?: Array<{
    codevId: string;
    absences: number;
    notificationSent: boolean;
  }>;
  error?: string;
}

/**
 * Check attendance records and send warnings for members with 3 or more absences
 */
export async function checkAttendanceWarnings(
  projectId: string,
  year: number,
  month: number
): Promise<AttendanceWarningResult> {
  const supabase = await createClientServerComponent();
  
  try {
    // Get current user to check if they're a team lead
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify user is team lead for this project
    const { data: teamLead } = await supabase
      .from("project_members")
      .select("*")
      .eq("project_id", projectId)
      .eq("role", "team_leader")
      .single();

    if (!teamLead || teamLead.codev_id !== user.id) {
      return { success: false, error: "Only team leads can check attendance warnings" };
    }

    // Get the meeting schedule for the project
    const { data: projectData } = await supabase
      .from("projects")
      .select("meeting_schedule")
      .eq("id", projectId)
      .single();

    // Get all members of the project
    const { data: members } = await supabase
      .from("project_members")
      .select("codev_id, codev(first_name, last_name, email_address)")
      .eq("project_id", projectId);

    if (!members) {
      return { success: false, error: "No members found" };
    }

    // Get attendance records for the month
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data: attendance } = await supabase
      .from("attendance")
      .select("*")
      .eq("project_id", projectId)
      .gte("date", startDate)
      .lte("date", endDate);

    if (!attendance) {
      return { success: false, error: "No attendance records found" };
    }

    // Count absences per member (excluding future dates and non-scheduled days)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day
    const meetingSchedule = projectData?.meeting_schedule || null;
    
    const absenceCounts = new Map<string, number>();
    attendance.forEach(record => {
      // Skip future dates
      const recordDate = new Date(record.date);
      if (recordDate > today) return;
      
      // Only count absences on scheduled meeting days
      if (isScheduledMeetingDay(recordDate, meetingSchedule) && record.status === "absent") {
        const current = absenceCounts.get(record.codev_id) || 0;
        absenceCounts.set(record.codev_id, current + 1);
      }
    });

    // Check for warnings and send notifications
    const warnings: any[] = [];
    
    for (const member of members) {
      const absences = absenceCounts.get(member.codev_id) || 0;
      
      if (absences >= ABSENCE_WARNING_THRESHOLD) {
        // Check if warning already sent this month
        const { data: existingWarning } = await supabase
          .from("notifications")
          .select("*")
          .eq("recipient_id", member.codev_id)
          .eq("project_id", projectId)
          .eq("type", "attendance")
          .gte("created_at", startDate)
          .lte("created_at", endDate)
          .like("metadata->month", `${year}-${month + 1}`);

        if (!existingWarning || existingWarning.length === 0) {
          // Send warning notification
          const notification = {
            recipient_id: member.codev_id,
            title: "Attendance Warning",
            message: `You have ${absences} absences this month. Your account may be deactivated if absences continue. Please contact your team lead if you have any concerns.`,
            type: "attendance" as const,
            priority: "urgent" as const,
            project_id: projectId,
            metadata: {
              absences,
              month: `${year}-${month + 1}`,
              threshold: ABSENCE_WARNING_THRESHOLD,
            }
          };

          const { error: notifError } = await supabase
            .from("notifications")
            .insert(notification);

          warnings.push({
            codevId: member.codev_id,
            absences,
            notificationSent: !notifError
          });

          // Also notify team lead
          if (!notifError) {
            await supabase
              .from("notifications")
              .insert({
                recipient_id: teamLead.codev_id,
                title: "Team Member Attendance Alert",
                message: `${member.codev.first_name} ${member.codev.last_name} has ${absences} absences this month and has been warned.`,
                type: "attendance" as const,
                priority: "high" as const,
                project_id: projectId,
                metadata: {
                  member_id: member.codev_id,
                  member_name: `${member.codev.first_name} ${member.codev.last_name}`,
                  absences,
                  month: `${year}-${month + 1}`,
                }
              });
          }
        } else {
          warnings.push({
            codevId: member.codev_id,
            absences,
            notificationSent: false // Already sent
          });
        }
      }
    }

    return { success: true, warnings };
  } catch (error) {
    console.error("Error checking attendance warnings:", error);
    return { success: false, error: "Failed to check attendance warnings" };
  }
}

/**
 * Get attendance summary with warning status for a project
 */
export async function getAttendanceWarningStatus(
  projectId: string,
  year: number,
  month: number
) {
  const supabase = await createClientServerComponent();
  
  try {
    // Get the meeting schedule for the project
    const { data: projectData } = await supabase
      .from("projects")
      .select("meeting_schedule")
      .eq("id", projectId)
      .single();
      
    // Get all members
    const { data: members } = await supabase
      .from("project_members")
      .select("codev_id, codev(first_name, last_name)")
      .eq("project_id", projectId);

    if (!members) {
      return { success: false, error: "No members found" };
    }

    // Get attendance for the month
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data: attendance } = await supabase
      .from("attendance")
      .select("*")
      .eq("project_id", projectId)
      .gte("date", startDate)
      .lte("date", endDate);

    // Count absences per member (excluding future dates and non-scheduled days)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day
    const meetingSchedule = projectData?.meeting_schedule || null;
    
    const memberStatus = members.map(member => {
      const memberAttendance = attendance?.filter(a => a.codev_id === member.codev_id) || [];
      
      // Filter out future dates and non-scheduled days
      const scheduledMeetingAttendance = memberAttendance.filter(a => {
        const recordDate = new Date(a.date);
        return recordDate <= today && isScheduledMeetingDay(recordDate, meetingSchedule);
      });
      
      const absences = scheduledMeetingAttendance.filter(a => a.status === "absent").length;
      
      return {
        codevId: member.codev_id,
        name: `${member.codev.first_name} ${member.codev.last_name}`,
        absences,
        hasWarning: absences >= ABSENCE_WARNING_THRESHOLD,
        attendancePercentage: scheduledMeetingAttendance.length > 0 
          ? Math.round(((scheduledMeetingAttendance.length - absences) / scheduledMeetingAttendance.length) * 100)
          : 100
      };
    });

    return { 
      success: true, 
      data: memberStatus,
      summary: {
        totalMembers: members.length,
        membersWithWarnings: memberStatus.filter(m => m.hasWarning).length,
        averageAttendance: Math.round(
          memberStatus.reduce((sum, m) => sum + m.attendancePercentage, 0) / members.length
        )
      }
    };
  } catch (error) {
    console.error("Error getting attendance warning status:", error);
    return { success: false, error: "Failed to get attendance status" };
  }
}