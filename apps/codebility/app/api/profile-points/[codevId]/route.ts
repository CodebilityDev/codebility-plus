// app/api/profile-points/[codevId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";
import {
  computeProfilePoints,
  persistProfilePoints,
} from "@/lib/server/profile-points";
import { z } from "zod";

const codevIdSchema = z.string().uuid("Invalid codev ID format");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codevId: string }> },
) {
  try {
    const { codevId } = await params;

    const validationResult = codevIdSchema.safeParse(codevId);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid codev ID format",
          details: validationResult.error.errors
            .map((e) => e.message)
            .join(", "),
        },
        { status: 400 },
      );
    }

    const validCodevId = validationResult.data;
    const supabase = await createClientServerComponent();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userRole, error: roleError } = await supabase
      .from("codev")
      .select("id, role_id")
      .eq("id", user.id)
      .single();

    if (roleError || !userRole) {
      return NextResponse.json(
        { error: "Failed to verify user permissions" },
        { status: 403 },
      );
    }

    const isAdmin = userRole.role_id === 1;
    const isOwnProfile = user.id === validCodevId;

    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const result = await computeProfilePoints(supabase, validCodevId);

    if (!result) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const insertError = await persistProfilePoints(
      supabase,
      validCodevId,
      result.breakdown,
    );

    if (insertError) {
      console.error("Error inserting profile points:", insertError);
      return NextResponse.json(
        {
          error: "Failed to save points",
          message: insertError.message,
          code: insertError.code,
          hint: insertError.hint,
        },
        { status: 500 },
      );
    }

    const { data: savedPoints, error: fetchError } = await supabase
      .from("profile_points")
      .select("*")
      .eq("codev_id", validCodevId)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching saved points:", fetchError);
      return NextResponse.json(
        {
          error: "Failed to fetch saved points",
          details: fetchError.message,
        },
        { status: 500 },
      );
    }

    const { completionDetails, dataCounts } = result;

    return NextResponse.json({
      success: true,
      totalPoints: result.totalPoints,
      maxPossiblePoints: result.maxPossiblePoints,
      completionPercentage: result.completionPercentage,
      pointsCount: savedPoints?.length || 0,
      points: savedPoints,
      breakdown: result.breakdown,
      completionDetails,
      summary: {
        profileSections: {
          basicInfo: {
            completed:
              completionDetails.image_url?.completed ||
              completionDetails.about?.completed ||
              completionDetails.phone_number?.completed,
            points:
              (completionDetails.image_url?.points || 0) +
              (completionDetails.about?.points || 0) +
              (completionDetails.phone_number?.points || 0) +
              (completionDetails.address?.points || 0),
            maxPoints: 12, // 5+3+2+2
          },
          socialLinks: {
            completed:
              completionDetails.github?.completed ||
              completionDetails.linkedin?.completed ||
              completionDetails.portfolio_website?.completed,
            points:
              (completionDetails.github?.points || 0) +
              (completionDetails.linkedin?.points || 0) +
              (completionDetails.portfolio_website?.points || 0) +
              (completionDetails.facebook?.points || 0) +
              (completionDetails.discord?.points || 0),
            maxPoints: 11, // 2+2+5+1+1
          },
          professionalInfo: {
            completed:
              completionDetails.tech_stacks?.completed ||
              completionDetails.work_experience?.completed ||
              completionDetails.education?.completed,
            points:
              (completionDetails.tech_stacks?.points || 0) +
              (completionDetails.work_experience?.points || 0) +
              (completionDetails.education?.points || 0) +
              (completionDetails.positions?.points || 0) +
              (completionDetails.years_of_experience?.points || 0),
            maxPoints: 104, // 20+40+24+15+5
          },
        },
        datacounts: dataCounts,
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
