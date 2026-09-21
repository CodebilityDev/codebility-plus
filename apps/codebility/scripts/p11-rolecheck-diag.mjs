// Diagnoses the flaky p9-role-check: repeats the by-id read for the same sampled
// rows many times and reports how often it returns no row, with the error text.
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const env = Object.fromEntries(
  fs
    .readFileSync(path.resolve(".env"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const COLS =
  "id, first_name, last_name, role_id, display_position, internal_status, availability_status, positions, nda_status, date_joined";

const { data: page1 } = await supabase
  .from("codev")
  .select(COLS, { count: "exact" })
  .eq("application_status", "passed")
  .order("date_joined", { ascending: false, nullsFirst: false })
  .order("id", { ascending: true })
  .range(0, 49);

const sample = (page1 ?? []).slice(0, 3);
console.log("sampled:", sample.map((r) => `${r.first_name} (role ${r.role_id})`).join(", "));

for (const row of sample) {
  const outcomes = [];
  for (let i = 0; i < 6; i++) {
    const { data, error } = await supabase
      .from("codev")
      .select("id, role_id")
      .eq("id", row.id)
      .single();
    outcomes.push(error ? `ERR ${error.code}:${error.message.slice(0, 40)}` : `role=${data.role_id}`);
  }
  console.log(`${row.first_name} listRole=${row.role_id} ->`, outcomes.join(" | "));
}
