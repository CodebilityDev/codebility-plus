import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";
import { requireUser } from "@/lib/server/auth-guard";

const ATTENDANCE_COLUMNS =
  "id, codev_id, project_id, date, status, check_in, check_out, notes, created_at, updated_at";

/**
 * Confirms the caller may read or write attendance for a project.
 *
 * This route is called from the client and previously ran entirely unchecked,
 * so any caller could read any project's attendance or write rows for any
 * codev. Admins (role_id 1) bypass, consistent with auth-guard.
 */
async function assertProjectAccess(
  supabase: Awaited<ReturnType<typeof createClientServerComponent>>,
  projectId: string,
  callerId: string,
  roleId: number | null,
) {
  if (roleId === 1) return;

  const { data: membership } = await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("codev_id", callerId)
    .maybeSingle();

  if (!membership) {
    throw new Error("Forbidden");
  }
}

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

    const { user, roleId } = await requireUser();
    const supabase = await createClientServerComponent();

    await assertProjectAccess(supabase, projectId, user.id, roleId);

    const { data, error } = await supabase
      .from("attendance")
      .select(ATTENDANCE_COLUMNS)
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
    const body = (await request.json()) as {
      codev_id: string;
      project_id: string;
      date: string;
      status: string;
      check_in?: string;
      check_out?: string;
    };
    const { codev_id, project_id, date, status, check_in, check_out } = body;

    if (!codev_id || !project_id || !date || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { user, roleId } = await requireUser();
    const supabase = await createClientServerComponent();

    await assertProjectAccess(supabase, project_id, user.id, roleId);

    // Check if attendance record exists
    const { data: existing } = await supabase
      .from("attendance")
      .select("id")
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
        .select(ATTENDANCE_COLUMNS)
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
        .select(ATTENDANCE_COLUMNS)
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