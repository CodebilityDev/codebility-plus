// Verifies the column lists narrowed in workstream E actually exist on the live
// schema. A wrong name returns PostgREST 42703, which is the same failure the
// app would hit at runtime, so this is a real check and not a re-statement of
// the source.
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
  ["settings/profile education", "education",
    "id, codev_id, institution, degree, major_subject, achievements, description, start_date, end_date, created_at, updated_at"],
  ["settings/profile work_experience", "work_experience",
    "id, codev_id, company_name, position, location, date_from, date_to, is_present, description"],
  ["settings/profile work_schedules", "work_schedules",
    "id, codev_id, days_of_week, start_time, end_time"],
  ["settings/profile job_status", "job_status",
    "id, job_title, company_name, employment_type, description, status, salary_range, work_setup, shift, codev_id, hours_per_week"],
  ["client-tracker history", "client_outreach",
    "id, admin_id, client_name, client_email, client_company, job_link, outreach_date, notes, conversation_image, week_start, created_at"],
  ["onboarding progress", "onboarding_videos",
    "id, applicant_id, video_number, completed, completed_at"],
  ["api/attendance GET", "attendance",
    "id, codev_id, project_id, date, status, check_in, check_out, notes, created_at, updated_at"],
  ["hire applications page", "job_applications",
    "id, job_id, first_name, last_name, email, phone, linkedin, github, portfolio, years_of_experience, cover_letter, experience, resume_url, applied_at, status, notes"],
  ["api/profile-points", "profile_points",
    "id, codev_id, category, points"],
  ["admin appointments page", "appointments",
    "id, first_name, last_name, email, phone_number, company_name, industry, service_interest, project_type, features_needed, referral_source, interest_level, other_requirements, appointment_date, appointment_time, meeting_type, meeting_tool_other, status, created_at"],
  ["announcements modal", "announcements",
    "id, category, title, banner_image, content, updated_at, created_at"],
  ["task comments fetch", "tasks_comments",
    "id, task_id, author_id, content, created_at, updated_at, parent_comment_id"],
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
