// Dumps the columns of the tables the remaining workstream-E queries read, so
// each select can name real fields. Read-only.
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
    console.log(`\n### ${table}: ${res.status} ${(await res.text()).slice(0, 70)}`);
    return;
  }
  const rows = await res.json();
  console.log(`\n### ${table}${rows[0] ? "" : " (empty)"}`);
  if (rows[0]) console.log(Object.keys(rows[0]).join(", "));
};

for (const t of [
  "notifications",
  "surveys",
  "survey_questions",
  "feature_modals",
  "news_banners",
  "client_outreach",
  "onboarding_videos",
  "overflow_comments",
  "job_applications",
  "profile_points",
  "appointments",
  "announcements",
  "tasks_comments",
  "codev_points",
]) {
  await dump(t);
}
