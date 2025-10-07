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

    // Try to use the optimized database function first
    const { data: leaders, error } = await supabase
      .rpc('get_technical_leaderboard', { 
        category_name: category,
        time_filter: timeFilter,
        result_limit: limit 
      });

    if (error) {
      // Fallback to manual query if RPC doesn't exist
      console.warn("RPC function not found, using fallback query:", error);
      
      // Optimized fallback using database-side aggregation
      let query = supabase
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

      // Apply time filters
      if (timeFilter === "weekly") {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        query = query.gte("created_at", weekStart.toISOString());
      } else if (timeFilter === "monthly") {
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        query = query.gte("created_at", monthStart.toISOString());
      }

      const { data: rawData, error: fallbackError } = await query;

      if (fallbackError) {
        console.error("Error fetching technical leaderboard:", fallbackError);
        return NextResponse.json(
          { error: "Failed to fetch leaderboard data", details: fallbackError.message },
          { status: 500 }
        );
      }

      if (!rawData || rawData.length === 0) {
        return NextResponse.json({ leaders: [], totalCount: 0 });
      }

      // Aggregate points by user (database should do this, but fallback for compatibility)
      const userPoints = new Map<string, {
        codev_id: string;
        first_name: string;
        total_points: number;
        latest_update: string;
      }>();

      rawData.forEach((item: any) => {
        const userId = item.codev_id;
        const existing = userPoints.get(userId);
        
        if (existing) {
          existing.total_points += item.points || 0;
          if (item.created_at > existing.latest_update) {
            existing.latest_update = item.created_at;
          }
        } else {
          userPoints.set(userId, {
            codev_id: userId,
            first_name: item.codev?.first_name || "Unknown",
            total_points: item.points || 0,
            latest_update: item.created_at
          });
        }
      });

      // Convert to array and sort
      const processedLeaders: TechnicalLeader[] = Array.from(userPoints.values())
        .filter(leader => leader.total_points > 0)
        .sort((a, b) => {
          if (b.total_points === a.total_points) {
            return a.first_name.localeCompare(b.first_name);
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
      codev_id: leader.codev_id,
      first_name: leader.first_name || "Unknown",
      total_points: leader.total_points || 0,
      latest_update: leader.latest_update
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