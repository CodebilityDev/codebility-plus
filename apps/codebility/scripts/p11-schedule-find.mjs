// Locates the real source of the time-tracker fields by probing tables for the
// columns the UI expects. Read-only.
import fs from "node:fs";
import path from "node:path";

for (const line of fs.readFileSync(path.resolve(".env"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const tryTable = async (table, select = "*") => {
  const res = await fetch(
    `${url}/rest/v1/${table}?select=${encodeURIComponent(select)}&limit=1`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  );
  const body = await res.text();
  let note = body.slice(0, 80);
  if (res.ok) {
    try {
      const rows = JSON.parse(body);
      note = rows[0] ? Object.keys(rows[0]).join(",").slice(0, 200) : "(empty)";
    } catch {}
  }
  console.log(`${table.padEnd(24)} ${res.status}  ${note}`);
};

console.log("--- tables that might hold start_time / end_time ---");
for (const t of [
  "codev",
  "work_schedules",
  "codev_schedule",
  "schedules",
  "codev_work_schedule",
  "attendance_summary",
  "codev_points",
  "profile_points",
]) {
  await tryTable(t);
}

console.log("\n--- does work_schedules have the shape the dashboard wants? ---");
for (const s of ["*", "codev_id,start_time,end_time", "start_time,end_time"]) {
  const res = await fetch(
    `${url}/rest/v1/work_schedules?select=${encodeURIComponent(s)}&limit=1`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  );
  console.log(`select=${s.padEnd(32)} ${res.status}  ${(await res.text()).slice(0, 90)}`);
}
