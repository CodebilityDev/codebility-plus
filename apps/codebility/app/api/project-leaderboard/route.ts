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

    // Try to use the optimized database function first
    const { data: leaders, error } = await supabase
      .rpc('get_project_leaderboard', { 
        time_filter: timeFilter,
        result_limit: limit 
      });

    if (error) {
      // Fallback to manual query if RPC doesn't exist
      console.warn("RPC function not found, using fallback query:", error);
      
      // Optimized fallback - single query with joins
      let baseQuery = `
        projects!inner(*),
        project_members!inner(
          codev_id,
          codev_points!inner(
            points,
            created_at,
            skill_category:skill_category_id!inner(name)
          )
        )
      `;

      let query = supabase
        .from("projects")
        .select(baseQuery);

      // Apply time filters through the relationship
      if (timeFilter === "weekly") {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        query = query.gte("project_members.codev_points.created_at", weekStart.toISOString());
      } else if (timeFilter === "monthly") {
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        query = query.gte("project_members.codev_points.created_at", monthStart.toISOString());
      }

      const { data: rawData, error: fallbackError } = await query.limit(100); // Get more projects to filter later

      if (fallbackError) {
        console.error("Error fetching project leaderboard:", fallbackError);
        return NextResponse.json(
          { error: "Failed to fetch leaderboard data", details: fallbackError.message },
          { status: 500 }
        );
      }

      if (!rawData || rawData.length === 0) {
        return NextResponse.json({ leaders: [], totalCount: 0 });
      }

      // Process the complex nested data structure
      const projectMap = new Map<string, {
        project_id: string;
        project_name: string;
        total_points: number;
        members: Set<string>;
        skill_breakdown: Record<string, number>;
      }>();

      rawData.forEach((project: any) => {
        if (!project.project_members || project.project_members.length === 0) return;

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

        project.project_members.forEach((member: any) => {
          projectData.members.add(member.codev_id);

          if (member.codev_points && member.codev_points.length > 0) {
            member.codev_points.forEach((point: any) => {
              const skillName = point.skill_category?.name || "Other";
              const pointValue = point.points || 0;
              
              projectData.total_points += pointValue;
              projectData.skill_breakdown[skillName] = 
                (projectData.skill_breakdown[skillName] || 0) + pointValue;
            });
          }
        });
      });

      // Convert to array and sort
      const processedLeaders: ProjectLeader[] = Array.from(projectMap.values())
        .map(project => ({
          project_id: project.project_id,
          project_name: project.project_name,
          total_points: project.total_points,
          member_count: project.members.size,
          skill_breakdown: project.skill_breakdown
        }))
        .filter(project => project.total_points > 0)
        .sort((a, b) => {
          if (b.total_points === a.total_points) {
            return a.project_name.localeCompare(b.project_name);
          }
          return b.total_points - a.total_points;
        })
        .slice(0, limit);

      return NextResponse.json({ 
        leaders: processedLeaders,
        totalCount: processedLeaders.length 
      });
    }

    // Process RPC results
    const processedLeaders = leaders?.map((leader: any) => ({
      project_id: leader.project_id,
      project_name: leader.project_name || "Unknown Project",
      total_points: leader.total_points || 0,
      member_count: leader.member_count || 0,
      skill_breakdown: leader.skill_breakdown || {}
    })) || [];

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