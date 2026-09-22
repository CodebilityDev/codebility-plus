import { NextRequest, NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";

/**
 * Public job-application intake, used by the careers page.
 *
 * This is intentionally unauthenticated: applicants are not signed in. It
 * previously spread the raw request body straight into `.insert(body)`, which
 * let a caller write arbitrary columns on the row (including any internal
 * status or score fields). The insert is now limited to the fields an
 * application form actually supplies.
 */
const ALLOWED_APPLICATION_FIELDS = [
  "job_id",
  "first_name",
  "last_name",
  "email_address",
  "phone_number",
  "about",
  "portfolio_website",
  "github",
  "linkedin",
  "resume_url",
] as const;

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const payload: Record<string, unknown> = {};
    for (const key of ALLOWED_APPLICATION_FIELDS) {
      if (body[key] !== undefined) payload[key] = body[key];
    }

    if (!payload.job_id) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClientServerComponent();

    const { data, error } = await supabase
      .from("job_applications")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("Error creating job application:", error);
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get('jobId');
    
    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClientServerComponent();
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("job_id", jobId)
      .order("applied_at", { ascending: false });

    if (error) {
      console.error("Error fetching job applications:", error);
      return NextResponse.json(
        { error: "Failed to fetch applications" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}