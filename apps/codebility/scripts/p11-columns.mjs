// Dumps the full column list of the tables workstream A could read. Read-only.
import fs from "node:fs";
import path from "node:path";

for (const line of fs.readFileSync(path.resolve(".env"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const dump = async (table) => {
  const res = await fetch(`${url}/rest/v1/${table}?limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    console.log(`${table}: ${res.status}`);
    return;
  }
  const rows = await res.json();
  console.log(`\n### ${table}`);
  console.log(rows[0] ? Object.keys(rows[0]).join(", ") : "(empty)");
};

for (const t of ["codev", "work_schedules", "attendance", "tasks", "projects"]) {
  await dump(t);
}
