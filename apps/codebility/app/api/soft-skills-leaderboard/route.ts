import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";

interface SoftSkillsLeader {
  codev_id: string;
  first_name: string;
  attendance_points: number;
  profile_points: number;
  total_points: number;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClientServerComponent();
    
    // Get all users with their names
    const { data: users, error: usersError } = await supabase
      .from("codev")
      .select("id, first_name")
      .order("first_name");

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ leaders: [] });
    }

    // Get all attendance points
    const { data: attendancePoints, error: attendanceError } = await supabase
      .from("attendance_points")
      .select("codev_id, points");

    if (attendanceError) {
      console.error("Error fetching attendance points:", attendanceError);
    }

    // Get all profile points, summed by user
    const { data: profilePointsData, error: profileError } = await supabase
      .from("profile_points")
      .select("codev_id, points");

    if (profileError) {
      console.error("Error fetching profile points:", profileError);
    }

    // Create lookup maps
    const attendanceMap = new Map<string, number>();
    attendancePoints?.forEach(ap => {
      attendanceMap.set(ap.codev_id, ap.points || 0);
    });

    const profileMap = new Map<string, number>();
    profilePointsData?.forEach(pp => {
      const currentPoints = profileMap.get(pp.codev_id) || 0;
      profileMap.set(pp.codev_id, currentPoints + (pp.points || 0));
    });

    // Combine data and calculate totals
    const leaders: SoftSkillsLeader[] = users.map(user => {
      const attendance_points = attendanceMap.get(user.id) || 0;
      const profile_points = profileMap.get(user.id) || 0;
      const total_points = attendance_points + profile_points;

      return {
        codev_id: user.id,
        first_name: user.first_name,
        attendance_points,
        profile_points,
        total_points
      };
    }).filter(leader => leader.total_points > 0) // Only include users with points
    .sort((a, b) => b.total_points - a.total_points) // Sort by total points descending
    .slice(0, 10); // Top 10

    return NextResponse.json({ 
      leaders,
      totalCount: leaders.length 
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}