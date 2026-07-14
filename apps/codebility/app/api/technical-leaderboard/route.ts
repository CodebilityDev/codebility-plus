import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";
import { z } from "zod";
import { getWeekRange, getMonthRange } from "@/lib/leaderboard-utils";

interface TechnicalLeader {
  codev_id: string;
  first_name: string;
  total_points: number;
  latest_update: string;
}

// Validation schema for query parameters
const querySchema = z.object({
  category: z.string().min(1, "Category is required"),
  timeFilter: z.enum(["all", "weekly", "monthly"]).default("all"),
  limit: z.string().optional().default("10").transform(Number).refine(n => n > 0 && n <= 50, "Limit must be between 1 and 50")
});

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);
    const { category, timeFilter, limit } = querySchema.parse(params);

    const supabase = await createClientServerComponent();
    
    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let processedLeaders: TechnicalLeader[] = [];

    // The tasks table is the single source of truth for points to ensure consistency
    // across all-time, monthly, and weekly leaderboards.
    let query = supabase
      .from("tasks")
      .select(`
        points,
        approved_at,
        codev_id,
        sidekick_ids,
        codev:codev_id(first_name),
        skill_category:skill_category_id!inner(name)
      `)
      .eq("skill_category.name", category)
      .eq("is_archive", true);

    if (timeFilter === "weekly") {
      const { startDate, endDate } = getWeekRange();
      query = query.gte("approved_at", startDate.toISOString()).lte("approved_at", endDate.toISOString());
    } else if (timeFilter === "monthly") {
      const { startDate, endDate } = getMonthRange();
      query = query.gte("approved_at", startDate.toISOString()).lte("approved_at", endDate.toISOString());
    }

    const { data: rawTasks, error: tasksError } = await query;

    if (tasksError) {
      console.error(`Error fetching ${timeFilter} technical leaderboard tasks:`, tasksError);
      return NextResponse.json(
        { error: "Failed to fetch tasks data", details: tasksError.message },
        { status: 500 }
      );
    }

    const userPointsMap = new Map<string, { total_points: number; latest_update: string; first_name?: string }>();
    const involvedUserIds = new Set<string>();

    rawTasks?.forEach((task: any) => {
      const points = task.points || 0;
      const sidekickPoints = Math.floor(points * 0.5);

      // Add points to primary assignee
      if (task.codev_id) {
        involvedUserIds.add(task.codev_id);
        const existing = userPointsMap.get(task.codev_id);
        if (existing) {
          existing.total_points += points;
          // Use approved_at instead of updated_at
          if (task.approved_at && task.approved_at > existing.latest_update) existing.latest_update = task.approved_at;
        } else {
          userPointsMap.set(task.codev_id, {
            total_points: points,
            latest_update: task.approved_at || new Date(0).toISOString(),
            first_name: task.codev?.first_name
          });
        }
      }

      // Add points to sidekicks
      if (task.sidekick_ids && Array.isArray(task.sidekick_ids)) {
        task.sidekick_ids.forEach((sidekickId: string) => {
          involvedUserIds.add(sidekickId);
          const existing = userPointsMap.get(sidekickId);
          if (existing) {
            existing.total_points += sidekickPoints;
            if (task.approved_at && task.approved_at > existing.latest_update) existing.latest_update = task.approved_at;
          } else {
            userPointsMap.set(sidekickId, {
              total_points: sidekickPoints,
              latest_update: task.approved_at || new Date(0).toISOString()
            });
          }
        });
      }
    });

    // Fetch missing first names (for sidekicks)
    const missingNameIds = Array.from(involvedUserIds).filter(id => !userPointsMap.get(id)?.first_name);
    
    if (missingNameIds.length > 0) {
      const { data: namesData } = await supabase
        .from("codev")
        .select("id, first_name")
        .in("id", missingNameIds);
      
      namesData?.forEach(n => {
        const user = userPointsMap.get(n.id);
        if (user) user.first_name = n.first_name;
      });
    }

    processedLeaders = Array.from(userPointsMap.entries())
      .map(([id, data]) => ({
        codev_id: id,
        first_name: data.first_name || "Unknown",
        total_points: data.total_points,
        latest_update: data.latest_update
      }))
      .filter(leader => leader.total_points > 0)
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