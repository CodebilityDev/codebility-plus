import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";
import { z } from "zod";

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

    if (timeFilter === "all") {
      // All-time leaderboard uses the codev_points/project_members relationship for historical data
      const { data: rawData, error: fallbackError } = await supabase
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

      if (fallbackError) {
        console.error("Error fetching all-time project leaderboard:", fallbackError);
        return NextResponse.json(
          { error: "Failed to fetch leaderboard data", details: fallbackError.message },
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

      rawData?.forEach((project: any) => {
        const projectId = project.id;
        if (!projectMap.has(projectId)) {
          projectMap.set(projectId, {
            project_id: projectId,
            project_name: project.name,
            total_points: 0,
            members: new Set(),
            skill_breakdown: {}
          });
        }
        const projectData = projectMap.get(projectId)!;

        project.project_members?.forEach((member: any) => {
          projectData.members.add(member.codev_id);
          member.codev_points?.forEach((point: any) => {
            const skillName = point.skill_category?.name || "Other";
            const val = point.points || 0;
            projectData.total_points += val;
            projectData.skill_breakdown[skillName] = (projectData.skill_breakdown[skillName] || 0) + val;
          });
        });
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

    } else {
      // Weekly/Monthly leaderboard calculates points from completed tasks based on approval date (updated_at)
      const startDate = new Date();
      if (timeFilter === "weekly") {
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0, 0);
      } else {
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
      }

      const { data: rawTasks, error: tasksError } = await supabase
        .from("tasks")
        .select(`
          points,
          updated_at,
          project_id,
          codev_id,
          sidekick_ids,
          project:project_id!inner(name),
          skill_category:skill_category_id!inner(name)
        `)
        .eq("is_archive", true)
        .gte("updated_at", startDate.toISOString());

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
    }

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