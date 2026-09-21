// Diagnoses the landing-interns 500: does the column the query orders by exist,
// and does the exact query the API route issues succeed?
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = Object.fromEntries(
  fs
    .readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [
        l.slice(0, i).trim(),
        l.slice(i + 1).trim().replace(/^["']|["']$/g, ""),
      ];
    }),
);

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// 1. Does the ranking column exist?
const withRank = await sb
  .from("codev")
  .select("id, landing_rank_score")
  .limit(1);

console.log("1) select landing_rank_score  ->", withRank.error ? JSON.stringify(withRank.error) : "OK");

// 2. The exact shape lib/server/landing-interns-cached.ts issues.
const page = await sb
  .from("codev")
  .select("id, first_name, last_name, display_position, image_url, role_id", {
    count: "exact",
  })
  .eq("availability_status", true)
  .in("role_id", [4, 10])
  .order("landing_rank_score", { ascending: false })
  .order("id", { ascending: true })
  .range(0, 9);

console.log(
  "2) landing interns page query ->",
  page.error ? JSON.stringify(page.error) : `OK rows=${page.data?.length} count=${page.count}`,
);

// 3. Sanity: does the table respond at all without ordering?
const plain = await sb.from("codev").select("id").limit(1);
console.log("3) plain select              ->", plain.error ? JSON.stringify(plain.error) : "OK");
