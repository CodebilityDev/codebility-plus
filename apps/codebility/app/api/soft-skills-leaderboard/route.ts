import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";
import { z } from "zod";

interface SoftSkillsLeader {
  codev_id: string;
  first_name: string;
  attendance_points: number;
  profile_points: number;
  total_points: number;
}

// Validation schema for query parameters
const querySchema = z.object({
  limit: z.string().optional().default("10").transform(Number).refine(n => n > 0 && n <= 50, "Limit must be between 1 and 50")
});

export async function GET(request: NextRequest) {
  try {
    // Validate query parameters
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);
    const { limit } = querySchema.parse(params);

    const supabase = await createClientServerComponent();
    
    // Verify user authentication and permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Single optimized query with JOINs and database-side aggregation
    const { data: leaders, error } = await supabase
      .rpc('get_soft_skills_leaderboard', { 
        result_limit: limit 
      });

    if (error) {
      // Fallback to manual query if RPC doesn't exist
      console.warn("RPC function not found, using fallback query:", error);
      
      // Optimized fallback using a single query with aggregation
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("codev")
        .select(`
          id,
          first_name,
          attendance_points:attendance_points(points),
          profile_points:profile_points(points)
        `)
        .not("first_name", "is", null);

      if (fallbackError) {
        console.error("Error fetching soft skills leaderboard:", fallbackError);
        return NextResponse.json(
          { error: "Failed to fetch leaderboard data", details: fallbackError.message },
          { status: 500 }
        );
      }

      if (!fallbackData || fallbackData.length === 0) {
        return NextResponse.json({ leaders: [], totalCount: 0 });
      }

      // Process the data with proper null handling
      const processedLeaders: SoftSkillsLeader[] = fallbackData.map(user => {
        // Handle attendance points (single record per user)
        const attendance_points = Array.isArray(user.attendance_points) 
          ? (user.attendance_points[0]?.points || 0)
          : (user.attendance_points?.points || 0);

        // Handle profile points (sum multiple records per user)
        const profile_points = Array.isArray(user.profile_points)
          ? user.profile_points.reduce((sum, pp) => sum + (pp?.points || 0), 0)
          : (user.profile_points?.points || 0);

        const total_points = attendance_points + profile_points;

        return {
          codev_id: user.id,
          first_name: user.first_name || "Unknown",
          attendance_points,
          profile_points,
          total_points
        };
      })
      .filter(leader => leader.total_points > 0) // Only users with points
      .sort((a, b) => b.total_points - a.total_points) // Sort by total points descending
      .slice(0, limit); // Apply limit

      return NextResponse.json({ 
        leaders: processedLeaders,
        totalCount: processedLeaders.length 
      });
    }

    // Process RPC results
    const processedLeaders = leaders?.map((leader: any) => ({
      codev_id: leader.codev_id,
      first_name: leader.first_name || "Unknown",
      attendance_points: leader.attendance_points || 0,
      profile_points: leader.profile_points || 0,
      total_points: leader.total_points || 0
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