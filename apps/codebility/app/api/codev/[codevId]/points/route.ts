import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codevId: string }> }
) {
  try {
    const { codevId } = await params;

    if (!codevId) {
      return NextResponse.json(
        { error: "Codev ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClientServerComponent();

    // Fetch skill points with skill category details
    const { data: skillPoints, error: skillError } = await supabase
      .from("codev_points")
      .select("*, skill_category(*)")
      .eq("codev_id", codevId);

    if (skillError) {
      console.error("Error fetching skill points:", skillError);
    }

    // Fetch attendance points from separate table
    const { data: attendanceData, error: attendanceError } = await supabase
      .from("attendance_points")
      .select("*")
      .eq("codev_id", codevId)
      .single();

    let attendancePoints = 0;

    // If no attendance points record exists, calculate from attendance table
    if (attendanceError && attendanceError.code === 'PGRST116') {
      const { data: attendanceCount } = await supabase
        .from("attendance")
        .select("*", { count: 'exact', head: true })
        .eq("codev_id", codevId)
        .in("status", ["present", "late"]);

      attendancePoints = (attendanceCount?.count || 0) * 2;

      // Create attendance_points record if there are attendance records
      if (attendancePoints > 0) {
        const { data: newRecord } = await supabase
          .from("attendance_points")
          .insert({
            codev_id: codevId,
            points: attendancePoints,
            last_updated: new Date().toISOString().split('T')[0]
          })
          .select()
          .single();

        if (newRecord) {
          attendancePoints = newRecord.points;
        }
      }
    } else if (!attendanceError) {
      attendancePoints = attendanceData?.points || 0;
    } else {
      console.error("Error fetching attendance points:", attendanceError);
    }

    // Calculate totals
    const totalSkillPoints = skillPoints?.reduce((sum, record) => sum + (record.points || 0), 0) || 0;
    const totalPoints = totalSkillPoints + attendancePoints;

    return NextResponse.json({
      skillPoints: skillPoints || [],
      attendancePoints,
      totalSkillPoints,
      totalPoints
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}