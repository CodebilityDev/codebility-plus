import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";
import { z } from "zod";

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

    // All-time leaderboard uses the codev_points running total for performance
    if (timeFilter === "all") {
      const { data: rawData, error: fallbackError } = await supabase
        .from("codev_points")
        .select(`
          codev_id,
          points,
          created_at,
          codev:codev_id!inner(first_name),
          skill_category:skill_category_id!inner(name)
        `)
        .eq("skill_category.name", category)
        .not("codev.first_name", "is", null);

      if (fallbackError) {
        console.error("Error fetching all-time technical leaderboard:", fallbackError);
        return NextResponse.json(
          { error: "Failed to fetch leaderboard data", details: fallbackError.message },
          { status: 500 }
        );
      }

      // Aggregate points (already aggregated in table, but handling duplicates just in case)
      const userPointsMap = new Map<string, TechnicalLeader>();

      rawData?.forEach((item: any) => {
        const userId = item.codev_id;
        const existing = userPointsMap.get(userId);
        
        if (existing) {
          existing.total_points += item.points || 0;
          if (item.created_at > existing.latest_update) {
            existing.latest_update = item.created_at;
          }
        } else {
          userPointsMap.set(userId, {
            codev_id: userId,
            first_name: item.codev?.first_name || "Unknown",
            total_points: item.points || 0,
            latest_update: item.created_at
          });
        }
      });

      processedLeaders = Array.from(userPointsMap.values())
        .filter(leader => leader.total_points > 0)
        .sort((a, b) => b.total_points - a.total_points)
        .slice(0, limit);

    } else {
      // Weekly/Monthly leaderboard calculates points from completed tasks based on approval date (updated_at)
      const startDate = new Date();
      if (timeFilter === "weekly") {
        startDate.setDate(startDate.getDate() - startDate.getDay()); // Sunday
        startDate.setHours(0, 0, 0, 0);
      } else {
        startDate.setDate(1); // 1st of month
        startDate.setHours(0, 0, 0, 0);
      }

      const { data: rawTasks, error: tasksError } = await supabase
        .from("tasks")
        .select(`
          points,
          updated_at,
          codev_id,
          sidekick_ids,
          codev:codev_id(first_name),
          skill_category:skill_category_id!inner(name)
        `)
        .eq("skill_category.name", category)
        .eq("is_archive", true)
        .gte("updated_at", startDate.toISOString());

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
            if (task.updated_at > existing.latest_update) existing.latest_update = task.updated_at;
          } else {
            userPointsMap.set(task.codev_id, {
              total_points: points,
              latest_update: task.updated_at,
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
              if (task.updated_at > existing.latest_update) existing.latest_update = task.updated_at;
            } else {
              userPointsMap.set(sidekickId, {
                total_points: sidekickPoints,
                latest_update: task.updated_at
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