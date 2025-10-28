// app/api/all-active-interns-codev-prioritized/route.ts
import { NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";
import { Codev } from "@/types/home/codev";
import { prioritizeCodevs } from "@/utils/codev-priority";

export async function GET() {
  try {
    const supabase = await createClientServerComponent();
    
    // Fetch comprehensive codev data with all necessary fields for prioritization
    const { data, error } = await supabase
      .from("codev")
      .select(`
        id,
        first_name,
        last_name,
        email_address,
        phone_number,
        address,
        about,
        display_position,
        image_url,
        internal_status,
        availability_status,
        level,
        application_status,
        years_of_experience,
        role_id,
        created_at,
        updated_at,
        codev_points (
          id,
          codev_id,
          skill_category_id,
          points
        ),
        work_experience (
          id,
          codev_id,
          position,
          description,
          date_from,
          date_to,
          company_name,
          location,
          is_present
        ),
        project_members (
          id,
          project_id,
          role,
          joined_at,
          projects (
            id,
            name,
            description,
            status,
            start_date,
            end_date,
            github_link,
            main_image,
            website_url,
            figma_link,
            client_id,
            categories:project_categories(
              projects_category(
                id,
                name,
                description
              )
            ),
            kanban_display,
            public_display
          )
        )
      `)
      .eq("availability_status", true)
      .in("role_id", [4, 10]); // Intern and Codev role IDs

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { TEAM_MEMBERS: [], error: error.message ?? "DB error" },
        { status: 500 }
      );
    }

    // Transform the data to match Codev interface
    const teamMembers: Codev[] = (data ?? []).map((row: any) => {
      // Transform project_members to projects format expected by Codev interface
      const projects = row.project_members?.map((pm: any) => ({
        ...pm.projects,
        role: pm.role,
        joined_at: pm.joined_at,
        // Flatten categories from nested structure
        categories: (pm.projects?.categories || []).map(
          (cat: any) => cat.projects_category
        ).filter(Boolean),
      })) || [];

      return {
        id: row.id,
        first_name: row.first_name,
        last_name: row.last_name,
        email_address: row.email_address,
        phone_number: row.phone_number,
        address: row.address,
        about: row.about,
        positions: [], // Empty array as this field isn't used in prioritization
        display_position: row.display_position,
        tech_stacks: [], // Empty array as this field isn't available
        image_url: row.image_url,
        internal_status: row.internal_status,
        availability_status: row.availability_status,
        level: row.level,
        application_status: row.application_status,
        work_experience: row.work_experience || [],
        created_at: row.created_at,
        updated_at: row.updated_at,
        years_of_experience: row.years_of_experience,
        role_id: row.role_id,
        codev_points: row.codev_points || [],
        projects: projects,
        project_members: row.project_members || [],
      } as Codev;
    });

    // Apply prioritization using the prioritizeCodevs function
    const prioritizedTeamMembers = prioritizeCodevs(teamMembers, false);

    // Transform back to the expected format for the component
    const TEAM_MEMBERS = prioritizedTeamMembers.map((codev) => {
      // Map role_id to role name (4 = Intern, 10 = Codev)
      const roleName = codev.role_id === 4 ? "Intern" : codev.role_id === 10 ? "Codev" : "Member";
      
      return {
        id: codev.id,
        name: `${codev.first_name} ${codev.last_name}`.trim(),
        role: roleName,
        image: codev.image_url,
        display_position: codev.display_position,
        // Include additional useful fields for display
        years_of_experience: codev.years_of_experience,
        internal_status: codev.internal_status,
        level: codev.level,
        codev_points: codev.codev_points,
        work_experience: codev.work_experience,
      };
    });

    console.log(`Prioritized ${TEAM_MEMBERS.length} team members`);

    return NextResponse.json({ TEAM_MEMBERS });
  } catch (err) {
    console.error("Unexpected error in /api/all-active-interns-codev-prioritized:", err);
    return NextResponse.json(
      { TEAM_MEMBERS: [], error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
