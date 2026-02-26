import { NextRequest, NextResponse } from "next/server";
// Using standard server component client — RLS access is granted via migration
// (supabase/migrations/YYYYMMDD_fix_soft_skills_leaderboard_rls.sql)
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
  limit: z
    .string()
    .optional()
    .default("10")
    .transform(Number)
    .refine(
      (n) => n > 0 && n <= 50,
      "Limit must be between 1 and 50"
    ),
});

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);
    const { limit } = querySchema.parse(params);

    const supabase = await createClientServerComponent();

    // Verify user is authenticated before returning leaderboard data
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try RPC first
    const { data: leaders, error } = await supabase.rpc(
      "get_soft_skills_leaderboard",
      { result_limit: limit }
    );

    if (error) {
      console.warn("RPC not found, using fallback query:", error);

      // Fallback: manual query across codev + related points tables
      // RLS SELECT policy on attendance_points and profile_points must allow
      // authenticated users to read all records (see migration file)
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("codev")
        .select(
          `
          id,
          first_name,
          attendance_points:attendance_points(points),
          profile_points:profile_points(points)
        `
        )
        .not("first_name", "is", null);

      if (fallbackError) {
        console.error("Error fetching soft skills leaderboard:", fallbackError);
        return NextResponse.json(
          {
            error: "Failed to fetch leaderboard data",
            details: fallbackError.message,
          },
          { status: 500 }
        );
      }

      if (!fallbackData || fallbackData.length === 0) {
        return NextResponse.json({ leaders: [], totalCount: 0 });
      }

      const processedLeaders: SoftSkillsLeader[] = fallbackData
        .map((user) => {
          // attendance_points is one record per user
          const attendance_points = Array.isArray(user.attendance_points)
            ? user.attendance_points[0]?.points || 0
            : (user.attendance_points as any)?.points || 0;

          // profile_points can have multiple records — sum all
          const profile_points = Array.isArray(user.profile_points)
            ? user.profile_points.reduce(
                (sum, pp) => sum + (pp?.points || 0),
                0
              )
            : (user.profile_points as any)?.points || 0;

          const total_points = attendance_points + profile_points;

          return {
            codev_id: user.id,
            first_name: user.first_name || "Unknown",
            attendance_points,
            profile_points,
            total_points,
          };
        })
        // FIX: Do NOT filter out zero-point users — frontend renders all rank slots
        // Filtering caused ranks 2–N to show "-" and "0" placeholders
        .sort((a, b) => b.total_points - a.total_points)
        .slice(0, limit);

      return NextResponse.json({
        leaders: processedLeaders,
        totalCount: processedLeaders.length,
      });
    }

    // Process RPC results
    const processedLeaders: SoftSkillsLeader[] =
      leaders?.map((leader: any) => ({
        codev_id: leader.codev_id,
        first_name: leader.first_name || "Unknown",
        attendance_points: leader.attendance_points || 0,
        profile_points: leader.profile_points || 0,
        total_points: leader.total_points || 0,
      })) || [];

    return NextResponse.json({
      leaders: processedLeaders,
      totalCount: processedLeaders.length,
    });
  } catch (error) {
    console.error("API error:", error);

    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json(
      {
        error: "Internal server error",
        ...(isDev && {
          details:
            error instanceof Error ? error.message : "Unknown error",
        }),
      },
      { status: 500 }
    );
  }
}