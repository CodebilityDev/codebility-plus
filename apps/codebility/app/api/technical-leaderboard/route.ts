import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";
import {
  getCachedAllTimeTechnicalLeaderboard,
  getTechnicalLeaderboard,
} from "@/lib/server/technical-leaderboard";
import { z } from "zod";

const querySchema = z.object({
  category: z.string().min(1, "Category is required"),
  timeFilter: z.enum(["all", "weekly", "monthly"]).default("all"),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform(Number)
    .refine((n) => n > 0 && n <= 50, "Limit must be between 1 and 50"),
});

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);
    const { category, timeFilter, limit } = querySchema.parse(params);

    const supabase = await createClientServerComponent();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // All-time boards are identical for every viewer, so they come from the
    // shared cache — switching between FE/BE/FS tabs is a cache hit after the
    // first look. Weekly/monthly read the project-scoped tasks table and are
    // window-dependent, so they stay uncached.
    const leaders =
      timeFilter === "all"
        ? await getCachedAllTimeTechnicalLeaderboard(category, limit)
        : await getTechnicalLeaderboard(supabase, {
            category,
            timeFilter,
            limit,
          });

    if (!leaders) {
      return NextResponse.json(
        { error: "Failed to fetch leaderboard data" },
        { status: 500 },
      );
    }

    return NextResponse.json({ leaders, totalCount: leaders.length });
  } catch (error) {
    console.error("API error:", error);

    const isDev = process.env.NODE_ENV === "development";

    return NextResponse.json(
      {
        error: "Internal server error",
        ...(isDev && {
          details: error instanceof Error ? error.message : "Unknown error",
        }),
      },
      { status: 500 },
    );
  }
}
