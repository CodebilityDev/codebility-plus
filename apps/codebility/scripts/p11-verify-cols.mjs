// Verifies the narrowed column lists against the live schema by issuing the
// exact selects the profile page now uses. A wrong name returns 42703.
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

const base = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const checks = [
  ["education", "id, codev_id, institution, degree, major_subject, category, current, achievements, description, start_date, end_date"],
  ["work_experience", "id, codev_id, company_name, position, location, date_from, date_to, current, description"],
  ["work_schedules", "id, codev_id, start_time, end_time, days_of_week, period"],
  ["job_status", "id, job_title, company_name, employment_type, description, status, salary_range, work_setup, shift, codev_id, hours_per_week"],
  ["appointments", "*"],
  ["client_outreach", "*"],
  ["onboarding_videos", "*"],
  ["profile_points", "*"],
];

for (const [table, cols] of checks) {
  const res = await fetch(`${base}/rest/v1/${table}?select=${encodeURIComponent(cols)}&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const body = await res.text();
  const ok = res.ok;
  console.log(`${ok ? "OK  " : "FAIL"} ${table.padEnd(20)} ${ok ? "" : body.slice(0, 110)}`);
}
