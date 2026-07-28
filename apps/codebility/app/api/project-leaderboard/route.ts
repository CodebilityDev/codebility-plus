import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";
import { z } from "zod";
import { getWeekRange, getMonthRange } from "@/lib/leaderboard-utils";

interface ProjectLeader {
  project_id: string;
  project_name: string;
  total_points: number;
  member_count: number;
  skill_breakdown: Record<string, number>;
}

// Validation schema for query parameters
const querySchema = z.object({
  timeFilter: z.enum(["all", "weekly", "monthly"]).default("all"),
  limit: z.string().optional().default("10").transform(Number).refine(n => n > 0 && n <= 50, "Limit must be between 1 and 50")
});

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);
    const { timeFilter, limit } = querySchema.parse(params);

    const supabase = await createClientServerComponent();
    
    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let processedLeaders: ProjectLeader[] = [];

    // All-time totals come from the codev_points ledger via project membership, NOT from
    // the tasks table. codev_points is append-only; the tasks table is mutable, so
    // recomputing all-time totals from tasks silently drops points whose originating task
    // was later deleted, un-archived, or had its skill_category cleared. Time-ranged views
    // below still derive from tasks, where the approval date is the whole point.
    if (timeFilter === "all") {
      const { data: rawData, error: allTimeError } = await supabase
        .from("projects")
        .select(`
          id,
          name,
          project_members(
            codev_id,
            codev_points(
              points,
              skill_category:skill_category_id(name)
            )
          )
        `);

      if (allTimeError) {
        console.error("Error fetching all-time project leaderboard:", allTimeError);
        return NextResponse.json(
          { error: "Failed to fetch leaderboard data", details: allTimeError.message },
          { status: 500 }
        );
      }

      const allTimeMap = new Map<string, {
        project_id: string;
        project_name: string;
        total_points: number;
        members: Set<string>;
        skill_breakdown: Record<string, number>;
      }>();

      rawData?.forEach((project: any) => {
        const projectId = project.id;
        if (!projectId) return;

        if (!allTimeMap.has(projectId)) {
          allTimeMap.set(projectId, {
            project_id: projectId,
            project_name: project.name || "Unknown Project",
            total_points: 0,
            members: new Set(),
            skill_breakdown: {}
          });
        }
        const projectData = allTimeMap.get(projectId)!;

        project.project_members?.forEach((member: any) => {
          if (member.codev_id) projectData.members.add(member.codev_id);
          member.codev_points?.forEach((point: any) => {
            const skillName = point.skill_category?.name || "Other";
            const val = point.points || 0;
            projectData.total_points += val;
            projectData.skill_breakdown[skillName] = (projectData.skill_breakdown[skillName] || 0) + val;
          });
        });
      });

      processedLeaders = Array.from(allTimeMap.values())
        .map(p => ({
          project_id: p.project_id,
          project_name: p.project_name,
          total_points: p.total_points,
          member_count: p.members.size,
          skill_breakdown: p.skill_breakdown
        }))
        .filter(p => p.total_points > 0)
        .sort((a, b) => b.total_points - a.total_points)
        .slice(0, limit);

      return NextResponse.json({
        leaders: processedLeaders,
        totalCount: processedLeaders.length
      });
    }

    // Weekly/monthly are derived from approved tasks within the requested window.
    let query = supabase
      .from("tasks")
      .select(`
        points,
        approved_at,
        project_id,
        codev_id,
        sidekick_ids,
        project:project_id!inner(name),
        skill_category:skill_category_id!inner(name)
      `)
      .eq("is_archive", true);

    if (timeFilter === "weekly") {
      const { startDate, endDate } = getWeekRange();
      query = query.gte("approved_at", startDate.toISOString()).lte("approved_at", endDate.toISOString());
    } else {
      const { startDate, endDate } = getMonthRange();
      query = query.gte("approved_at", startDate.toISOString()).lte("approved_at", endDate.toISOString());
    }

    const { data: rawTasks, error: tasksError } = await query;

    if (tasksError) {
      console.error(`Error fetching ${timeFilter} project leaderboard tasks:`, tasksError);
      return NextResponse.json(
        { error: "Failed to fetch tasks data", details: tasksError.message },
        { status: 500 }
      );
    }

    const projectMap = new Map<string, {
      project_id: string;
      project_name: string;
      total_points: number;
      members: Set<string>;
      skill_breakdown: Record<string, number>;
    }>();

    rawTasks?.forEach((task: any) => {
      const projectId = task.project_id;
      if (!projectId) return;

      if (!projectMap.has(projectId)) {
        projectMap.set(projectId, {
          project_id: projectId,
          project_name: task.project?.name || "Unknown Project",
          total_points: 0,
          members: new Set(),
          skill_breakdown: {}
        });
      }
      const projectData = projectMap.get(projectId)!;
      const skillName = task.skill_category?.name || "Other";
      const points = task.points || 0;
      const sidekickPoints = Math.floor(points * 0.5);

      // Add primary assignee points
      if (task.codev_id) {
        projectData.members.add(task.codev_id);
        projectData.total_points += points;
        projectData.skill_breakdown[skillName] = (projectData.skill_breakdown[skillName] || 0) + points;
      }

      // Add sidekick points
      if (task.sidekick_ids && Array.isArray(task.sidekick_ids)) {
        task.sidekick_ids.forEach((sid: string) => {
          projectData.members.add(sid);
          projectData.total_points += sidekickPoints;
          projectData.skill_breakdown[skillName] = (projectData.skill_breakdown[skillName] || 0) + sidekickPoints;
        });
      }
    });

    processedLeaders = Array.from(projectMap.values())
      .map(p => ({
        project_id: p.project_id,
        project_name: p.project_name,
        total_points: p.total_points,
        member_count: p.members.size,
        skill_breakdown: p.skill_breakdown
      }))
      .filter(p => p.total_points > 0)
      .sort((a, b) => b.total_points - a.total_points)
      .slice(0, limit);

    return NextResponse.json({ 
      leaders: processedLeaders,
      totalCount: processedLeaders.length 
    });

  } catch (error) {
    console.error("API error:", error);
    
    // Provide more specific error information in development
    const isDev = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        ...(isDev && { details: error instanceof Error ? error.message : 'Unknown error' })
      },
      { status: 500 }
    );
  }
}