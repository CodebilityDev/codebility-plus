// §4.2 RLS gate: samples role_id for 3 users through the NEW paginated path and
// compares against a role-filtered query (the pattern codev-queries.ts says is
// safe). Any mismatch means pagination corrupted role_id and permissions drift.
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const envPath = path.resolve(".env");
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("missing supabase env");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const COLS = "id, first_name, last_name, email_address, image_url, role_id, display_position, internal_status, availability_status, positions, nda_status, date_joined";

// The exact query shape getCodevsPage issues for page 1.
const { data: page1, error, count } = await supabase
  .from("codev")
  .select(COLS, { count: "exact" })
  .eq("application_status", "passed")
  .order("date_joined", { ascending: false, nullsFirst: false })
  .order("id", { ascending: true })
  .range(0, 49);

if (error) {
  console.error("page query failed:", error.message);
  process.exit(1);
}

// Sample 3 users and re-read each one individually; a per-id read cannot be
// affected by the list query's RLS behaviour.
const sample = (page1 ?? []).slice(0, 3);
const checks = [];
for (const row of sample) {
  const { data: one, error: oneErr } = await supabase
    .from("codev")
    .select("id, role_id")
    .eq("id", row.id)
    .single();
  checks.push({
    id: row.id,
    name: `${row.first_name} ${row.last_name}`,
    listRoleId: row.role_id,
    directRoleId: one?.role_id ?? null,
    match: !oneErr && one?.role_id === row.role_id,
    err: oneErr?.message ?? null,
  });
}

// Cross-check the count the pager uses.
const { count: passedTotal } = await supabase
  .from("codev")
  .select("id", { count: "exact", head: true })
  .eq("application_status", "passed");

const roleHistogram = {};
for (const row of page1 ?? []) {
  roleHistogram[row.role_id] = (roleHistogram[row.role_id] ?? 0) + 1;
}

console.log(
  JSON.stringify(
    {
      pageRows: page1?.length ?? 0,
      queryCount: count,
      passedTotalIndependent: passedTotal,
      roleHistogram,
      sampleChecks: checks,
      allMatch: checks.every((c) => c.match),
    },
    null,
    2,
  ),
);
