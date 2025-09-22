// app/api/all-active-interns/route.ts
import { NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";

type Intern = {
  name: string;
  role: string;
  image?: string;
  display_position?: string;
};

export async function GET() {
  try {
    const supabase = await createClientServerComponent();
    const { data, error } = await supabase
      .from("codev")
      .select(
        `
        first_name,
        last_name,
        image_url,
        availability_status,
        display_position,
        roles!inner ( name )
      `
      )
      .eq("availability_status", true)
      .in("roles.name", ["Intern", "Codev"]); // ✅ Interns or Codev

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { INTERNS: [], error: error.message ?? "DB error" },
        { status: 500 }
      );
    }

    console.log("Debug - Raw data from Supabase:", data); // Add this to debug

    const INTERNS: Intern[] = (data ?? []).map((row: any) => {
      const name = `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim();
      const role = row.roles?.name ?? "Intern";
      return {
        name: name || "Unknown Intern",
        role,
        image: row.image_url ?? undefined,
        display_position: row.display_position ?? undefined,
      };
    });

    console.log("Debug - Processed INTERNS:", INTERNS); // Add this to debug

    return NextResponse.json({ INTERNS });
  } catch (err) {
    console.error("Unexpected error in /api/interns:", err);
    return NextResponse.json(
      { INTERNS: [], error: "Unexpected server error" },
      { status: 500 }
    );
  }
}