"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths
} from "date-fns";

export type LeaderboardTimeRange = "this-week" | "last-week" | "this-month" | "last-month";

export interface LeaderboardMember {
  id: string;
  name: string;
  image_url: string | null;
  role: string;
  attendance_points: number;
  task_points: number;
  activity_points: number;
  total_points: number;
  tasks_completed: number;
  present_count: number;
}

/**
 * Fetches the leaderboard for a specific project based on a time range.
 * 
 * @param projectId - The project ID
 * @param timeRange - The period to calculate points for
 * @returns Promise with leaderboard data
 */
export async function getLeaderboardData(
  projectId: string,
  timeRange: LeaderboardTimeRange = "this-week"
): Promise<{
  success: boolean;
  data: LeaderboardMember[];
  error?: string;
}> {
  const supabase = await createClientServerComponent();
  const now = new Date();

  let startDate: Date;
  let endDate: Date;

  switch (timeRange) {
    case "last-week":
      const prevWeek = subWeeks(now, 1);
      startDate = startOfWeek(prevWeek, { weekStartsOn: 1 });
      endDate = endOfWeek(prevWeek, { weekStartsOn: 1 });
      break;
    case "this-month":
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
    case "last-month":
      const prevMonth = subMonths(now, 1);
      startDate = startOfMonth(prevMonth);
      endDate = endOfMonth(prevMonth);
      break;
    case "this-week":
    default:
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      endDate = endOfWeek(now, { weekStartsOn: 1 });
      break;
  }

  try {
    // 1. Get all members of the project
    const { data: projectMembers, error: membersError } = await supabase
      .from("project_members")
      .select(`
        codev_id,
        role,
        codev:codev_id (
          id,
          first_name,
          last_name,
          image_url
        )
      `)
      .eq("project_id", projectId);

    if (membersError) throw membersError;
    if (!projectMembers) return { success: true, data: [] };

    const codevIds = projectMembers.map((pm) => pm.codev_id);

    // 2. Fetch Attendance for the period
    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance")
      .select("*")
      .eq("project_id", projectId)
      .in("codev_id", codevIds)
      .gte("date", startDate.toISOString().split("T")[0])
      .lte("date", endDate.toISOString().split("T")[0]);

    if (attendanceError) throw attendanceError;

    // 3. Fetch Completed Tasks for the period
    const { data: taskData, error: tasksError } = await supabase
      .from("tasks")
      .select(`
        *,
        kanban_column:kanban_columns!inner(
          name,
          board:kanban_boards!inner(project_id)
        )
      `)
      .eq("kanban_column.board.project_id", projectId)
      .in("codev_id", codevIds)
      .or('name.ilike.Done,name.ilike.Completed', { foreignTable: 'kanban_columns' })
      .gte("updated_at", startDate.toISOString())
      .lte("updated_at", endDate.toISOString());

    if (tasksError) {
      console.warn("Task fetch error:", tasksError);
    }

    // 4. Calculate Points for each member
    const leaderboard: LeaderboardMember[] = projectMembers.map((pm) => {
      const codev = pm.codev as any;
      const memberCodevId = pm.codev_id;

      // Attendance Calculation
      const memberAttendance = attendanceData?.filter(a => a.codev_id === memberCodevId) || [];
      const presentCount = memberAttendance.filter(a => a.status === "present").length;
      const lateCount = memberAttendance.filter(a => a.status === "late").length;
      const attPoints = (presentCount * 10) + (lateCount * 5);

      // Task Completion Calculation
      const memberTasks = taskData?.filter(t => t.codev_id === memberCodevId) || [];
      const tasksCompleted = memberTasks.length;
      const taskPoints = memberTasks.reduce((sum, task) => {
        if (task.points) return sum + task.points;
        const diff = task.difficulty?.toLowerCase();
        if (diff === "hard") return sum + 200;
        if (diff === "medium") return sum + 100;
        return sum + 50;
      }, 0);

      const hasAnyActivity = memberAttendance.length > 0 || memberTasks.length > 0;
      const activityPoints = hasAnyActivity ? 10 : 0;

      const totalPoints = attPoints + taskPoints + activityPoints;

      return {
        id: memberCodevId,
        name: `${codev?.first_name || ""} ${codev?.last_name || ""}`.trim(),
        image_url: codev?.image_url || null,
        role: pm.role,
        attendance_points: attPoints,
        task_points: taskPoints,
        activity_points: activityPoints,
        total_points: totalPoints,
        tasks_completed: tasksCompleted,
        present_count: presentCount
      };
    });

    leaderboard.sort((a, b) => b.total_points - a.total_points);

    return { success: true, data: leaderboard };
  } catch (error: any) {
    console.error("Error calculating leaderboard:", error);
    return { success: false, data: [], error: error.message };
  }
}

// Keep backward compatibility
export async function getWeeklyLeaderboard(projectId: string): Promise<{
  success: boolean;
  data: LeaderboardMember[];
  error?: string;
}> {
  return getLeaderboardData(projectId, "this-week");
}
