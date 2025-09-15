// app/api/team/route.ts
import { NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";

type Person = { name: string; role: string; image?: string };

// Replace from the admin group
const CEO_FULL_NAME = process.env.CEO_FULLNAME ?? ""; // or import from a shared constants file

export async function GET() {
  try {
    const supabase = await createClientServerComponent();

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
      .in("roles.name", ["Admin", "Mentor"]);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { ADMINS: [], MENTORS: [], CEO: null, error: error.message ?? "DB error" },
        { status: 500 }
      );
    }

    const ADMINS: Person[] = [];
    const MENTORS: Person[] = [];
    let CEO: Person | null = null;

    (data ?? []).forEach((row: any) => {
      const name = `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim();
      const role = row.roles?.name ?? "Member";
      const person: Person = {
        name: name || "Unknown",
        role,
        image: row.image_url ?? undefined,
      };

      // Normalize comparison
      const normalizedName = name.toLowerCase();
      const normalizedCEO = CEO_FULL_NAME.trim().toLowerCase();

      if (role === "Admin" && normalizedCEO && normalizedName === normalizedCEO) {
        // ✅ Found CEO: assign to CEO, exclude from ADMINS
        CEO = { ...person, role: "Founder / CEO" };
      } else if (role === "Admin") {
        ADMINS.push(person);
      } else if (role === "Mentor") {
        MENTORS.push(person);
      }
    });

    // filter admins with project_id e0124447-1978-400f-bfc7-7ea2f974d100 and role `member` or project_id 54d5fba1-056c-45a2-b492-02eec8530640 and role `member` or name is `Ian Troy Pahilga
    const filteredAdmins = ADMINS.filter((admin) => {
      const projectMember = data?.find((row: any) => {
        const name = `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim();
        return name === admin.name;
      })?.project_members;

      return !projectMember?.some((pm: any) => ((pm.project_id === 'e0124447-1978-400f-bfc7-7ea2f974d100' && pm.role === 'member') || (pm.project_id === '54d5fba1-056c-45a2-b492-02eec8530640' && pm.role === 'member'))) && admin.name !== 'Ian Troy Pahilga';
    });

    return NextResponse.json({ ADMINS: filteredAdmins, MENTORS, CEO });
  } catch (err) {
    console.error("Unexpected error in /api/team:", err);
    return NextResponse.json(
      { ADMINS: [], MENTORS: [], CEO: null, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}