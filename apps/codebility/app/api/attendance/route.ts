import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!projectId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const supabase = await createClientServerComponent();
    
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("project_id", projectId)
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) {
      console.error("Error fetching attendance:", error);
      return NextResponse.json(
        { error: "Failed to fetch attendance" },
        { status: 500 }
      );
    }

    return NextResponse.json({ attendance: data || [] });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { codev_id, project_id, date, status, check_in, check_out } = body;

    if (!codev_id || !project_id || !date || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClientServerComponent();
    
    // Check if attendance record exists
    const { data: existing } = await supabase
      .from("attendance")
      .select("*")
      .eq("codev_id", codev_id)
      .eq("project_id", project_id)
      .eq("date", date)
      .single();

    let result;
    if (existing) {
      // Update existing record
      result = await supabase
        .from("attendance")
        .update({
          status,
          check_in,
          check_out,
          updated_at: new Date().toISOString()
        })
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      // Create new record
      result = await supabase
        .from("attendance")
        .insert({
          codev_id,
          project_id,
          date,
          status,
          check_in,
          check_out
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error("Error saving attendance:", result.error);
      console.error("Error details:", {
        code: result.error.code,
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint
      });
      return NextResponse.json(
        { error: `Failed to save attendance: ${result.error.message}` },
        { status: 500 }
      );
    }

    // Points are automatically updated by database trigger

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}