import { NextRequest, NextResponse } from "next/server";
import { createClientAnon } from "@/utils/supabase/anon";

const cacheHeaders = {
  "Cache-Control":
    "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const supabase = createClientAnon();

    const { data: memberProjects, error: memberError } = await supabase
      .from("project_members")
      .select("project_id")
      .eq("codev_id", id);

    if (memberError) {
      console.error("Error fetching profile project ids:", memberError);
      return NextResponse.json(
        { projects: [] },
        { status: 500, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!memberProjects || memberProjects.length === 0) {
      return NextResponse.json({ projects: [] }, { headers: cacheHeaders });
    }

    const projectIds = memberProjects.map((row) => row.project_id);

    const { data: projects, error: projectError } = await supabase
      .from("projects")
      .select("id, name, main_image")
      .in("id", projectIds);

    if (projectError) {
      console.error("Error fetching profile projects:", projectError);
      return NextResponse.json(
        { projects: [] },
        { status: 500, headers: { "Cache-Control": "no-store" } },
      );
    }

    const result = (projects ?? []).map((project) => ({
      project_id: project.id,
      name: project.name,
      main_image: project.main_image,
    }));

    return NextResponse.json({ projects: result }, { headers: cacheHeaders });
  } catch (err) {
    console.error("Unexpected error in /api/profile-projects:", err);
    return NextResponse.json(
      { projects: [] },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
