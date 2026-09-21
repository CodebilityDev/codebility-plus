// Second pass: the selects narrowed after the first verification run.
import fs from "node:fs";
import path from "node:path";

const env = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
const g = (k) => {
  const m = env.match(new RegExp("^" + k + "=(.+)", "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : null;
};
const url = g("NEXT_PUBLIC_SUPABASE_URL");
const key = g("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const H = { apikey: key, Authorization: "Bearer " + key };

const CASES = [
  ["settings/profile getWorkSchedule", "work_schedules",
    "id, codev_id, days_of_week, start_time, end_time"],
  ["settings/profile job_status writes", "job_status",
    "id, job_title, company_name, employment_type, description, status, salary_range, work_setup, shift, codev_id, hours_per_week"],
  ["attendance-service existence", "attendance", "id"],
  ["attendance-service points", "attendance_points", "points, last_updated"],
  ["attendance-sync existence", "attendance_points", "id"],
  ["api codev points", "attendance_points", "points, last_updated"],
  ["my-team project points", "attendance_points", "points, last_updated"],
  ["attendance-warnings team lead", "project_members", "codev_id"],
  ["promote-modal fetchModalById", "feature_modals",
    "id, badge, headline, subheadline, cta_label, cta_href, dismiss_label, features, is_active, image_url, created_at, updated_at"],
  ["kanban tasks codev_points", "codev_points", "id, points"],
  ["update-developer-levels", "levels", "level"],
  ["kanban promote draft", "task_drafts",
    "id, project_id, created_by, codev_id, title, description, type, priority, difficulty, points, deadline, intended_column_id, skill_category_id, sidekick_ids, pr_link, created_at"],
  ["onboarding video existence", "onboarding_videos", "id"],
];

let failures = 0;
for (const [label, table, cols] of CASES) {
  const r = await fetch(
    url + "/rest/v1/" + table + "?select=" + encodeURIComponent(cols) + "&limit=1",
    { headers: H },
  );
  if (r.status === 200) {
    console.log("OK   " + label.padEnd(32));
  } else {
    failures++;
    console.log("FAIL " + label.padEnd(32) + JSON.stringify(await r.json()));
  }
}

console.log(failures === 0 ? "\nAll selects valid." : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
