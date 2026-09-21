// Inspects the tables the time tracker could legitimately read, so the fix maps
// to real columns instead of invented ones. Read-only.
import fs from "node:fs";
import path from "node:path";

for (const line of fs.readFileSync(path.resolve(".env"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const cols = async (table) => {
  const res = await fetch(`${url}/rest/v1/${table}?limit=2`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) return { table, status: res.status, body: (await res.text()).slice(0, 100) };
  const rows = await res.json();
  return {
    table,
    status: res.status,
    rowCount: rows.length,
    columns: rows[0] ? Object.keys(rows[0]) : [],
    sample: rows[0] ?? null,
  };
};

for (const t of ["attendance", "tasks", "projects", "time_logs", "attendance_summary"]) {
  console.log(JSON.stringify(await cols(t), null, 2));
}
