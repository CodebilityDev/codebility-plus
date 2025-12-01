// app/api/team/route.ts
import { NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";

type Person = { name: string; role: string; image?: string };

// CEO identification
const CEO_FIRST_NAME = "Jzeff Kendrew";
const CEO_LAST_NAME = "Somera";

export async function GET() {
  try {
    const supabase = await createClientServerComponent();

    // Fetch CEO and Admins/Mentors separately
    const { data: ceoData, error: ceoError } = await supabase
      .from("codev")
      .select(`
        first_name,
        last_name,
        image_url
      `)
      .eq("first_name", CEO_FIRST_NAME)
      .eq("last_name", CEO_LAST_NAME)
      .eq("availability_status", true)
      .single();

    let CEO: Person | null = null;
    
    if (!ceoError && ceoData) {
      CEO = {
        name: `${ceoData.first_name} ${ceoData.last_name}`.replace(/\s+/g, ' ').trim(),
        role: "Founder / CEO",
        image: ceoData.image_url ?? undefined
      };
    }

    // Fetch Admins and Mentors (excluding CEO)
    const { data, error } = await supabase
      .from("codev")
      .select(`
        first_name,
        last_name,
        image_url,
        availability_status,
        project_members (
          project_id,
          role
        ),
        roles!inner ( name )
      `)
      .eq("availability_status", true)
      .in("roles.name", ["Admin", "Mentor"])
      .neq("first_name", CEO_FIRST_NAME); // Exclude CEO from this query

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { ADMINS: [], MENTORS: [], CEO, error: error.message ?? "DB error" },
        { status: 500 }
      );
    }

    const ADMINS: Person[] = [];
    const MENTORS: Person[] = [];

    (data ?? []).forEach((row: any) => {
      const firstName = (row.first_name ?? "").trim();
      const lastName = (row.last_name ?? "").trim();
      const name = `${firstName} ${lastName}`.replace(/\s+/g, ' ').trim();
      const role = row.roles?.name ?? "Member";
      
      const person: Person = {
        name: name || "Unknown",
        role,
        image: row.image_url ?? undefined,
      };

      if (role === "Admin") {
        ADMINS.push(person);
      } else if (role === "Mentor") {
        MENTORS.push(person);
      }
    });

    

    return NextResponse.json({ 
      ADMINS, 
      MENTORS,
      CEO
    });
    
  } catch (err) {
    console.error("Unexpected error in /api/team:", err);
    return NextResponse.json(
      { ADMINS: [], MENTORS: [], CEO: null, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}