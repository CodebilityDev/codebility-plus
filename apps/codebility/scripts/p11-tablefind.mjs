// Finds the real time-tracking table(s) by probing candidate names. Read-only.
import fs from "node:fs";
import path from "node:path";

for (const line of fs.readFileSync(path.resolve(".env"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const candidates = [
  "time_logs",
  "time_log",
  "attendance",
  "time_tracker",
  "codev_time_log",
  "work_logs",
  "job_status",
  "work_schedules",
  "attendance_points",
  "time_entries",
  "timelog",
  "time_logs_v2",
];

for (const t of candidates) {
  const res = await fetch(`${url}/rest/v1/${t}?limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const body = await res.text();
  let doc = "";
  if (res.ok) {
    try {
      const rows = JSON.parse(body);
      doc = rows[0] ? Object.keys(rows[0]).join(",").slice(0, 160) : "(empty table)";
    } catch {}
  }
  console.log(`${t.padEnd(20)} ${res.status}  ${doc || body.slice(0, 90)}`);
}
