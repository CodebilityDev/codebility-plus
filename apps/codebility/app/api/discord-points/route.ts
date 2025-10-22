// app/api/discord-points/route.ts
import { NextResponse } from "next/server";
import { createClientServerComponent } from "@/utils/supabase/server";

/**
 * GET: Fetch all discord_points data from Supabase
 * POST: Receive XP/level updates from Experienced bot export or script
 */

export async function GET() {
  try {
    const supabase = await createClientServerComponent();

    const { data, error } = await supabase
      .from("discord_points")
      .select("*")
      .order("xp", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("GET /discord-points Error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClientServerComponent();
    const body = await request.json();

    // --- CASE 1: Bulk data import from Experienced Bot (/manage export) ---
    if (Array.isArray(body)) {
      type ExportEntry = { id?: string; xp?: number };
      const entries = body as ExportEntry[];

      // Filter & format valid entries
      const validEntries = entries
        .filter((entry) => entry.id && typeof entry.xp === "number")
        .map((entry) => ({
          user_id: entry.id!,
          username: entry.id!, // Experienced export doesn't include username
          xp: entry.xp!,
          level: Math.floor(entry.xp! / 1000), // Optional computed level
          last_message_at: new Date().toISOString(),
        }));

      if (!validEntries.length) {
        return NextResponse.json(
          { success: false, message: "No valid entries in provided data." },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("discord_points")
        .upsert(validEntries, { onConflict: "user_id" });

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: "XP data from Experienced export synced successfully",
        count: validEntries.length,
      });
    }

    // --- CASE 2: Single user XP update (custom or webhook) ---
    const { user_id, username, xp, level } = body as {
      user_id?: string;
      username?: string;
      xp?: number;
      level?: number;
    };

    if (!user_id || typeof xp !== "number") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid required fields." },
        { status: 400 }
      );
    }

    const computedLevel = level ?? Math.floor(xp / 1000);

    const { error } = await supabase.from("discord_points").upsert({
      user_id,
      username: username || user_id,
      xp,
      level: computedLevel,
      last_message_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "XP data updated successfully",
    });
  } catch (error: any) {
    console.error("POST /discord-points Error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}