import { createClientServerComponent } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentDay } = body;

    if (!currentDay) {
      return NextResponse.json(
        { error: "currentDay is required" },
        { status: 400 }
      );
    }

    // Get supabase client
    const supabase = await createClientServerComponent();

    // Query projects with meeting schedules
    const { data: allProjects, error: projectsError } = await supabase
      .from("projects")
      .select(`
        id,
        name,
        meeting_schedule,
        meeting_link
      `)
      .not("meeting_schedule", "is", null);

    if (projectsError) {
      console.error("❌ Projects query failed:", projectsError);
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to fetch projects",
          details: {
            message: projectsError.message,
            hint: projectsError.hint
          }
        },
        { status: 500 }
      );
    }

    // Filter projects that have meetings today
    const projectsWithMeetingsToday = allProjects?.filter((project) => {
      const schedule = project.meeting_schedule as {
        selectedDays: string[];
        time: string;
        meetingLink?: string;
      } | null;

      // Check if today is a meeting day
      return schedule?.time && 
             schedule?.selectedDays && 
             schedule.selectedDays.includes(currentDay.toLowerCase());
    }) || [];

    return NextResponse.json({
      success: true,
      projects: projectsWithMeetingsToday,
      count: projectsWithMeetingsToday.length,
      currentDay
    });

  } catch (error) {
    console.error("❌ Error in projects/today API:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        details: {
          message: error instanceof Error ? error.message : String(error),
        }
      },
      { status: 500 }
    );
  }
}