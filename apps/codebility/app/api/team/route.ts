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

    return NextResponse.json({ ADMINS, MENTORS, CEO });
  } catch (err) {
    console.error("Unexpected error in /api/team:", err);
    return NextResponse.json(
      { ADMINS: [], MENTORS: [], CEO: null, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}