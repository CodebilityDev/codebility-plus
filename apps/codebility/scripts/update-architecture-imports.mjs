import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const replacements = [
  ["@/app/auth/actions", "@/actions/auth"],
  ["@/app/home/applicants/_service/action", "@/actions/applicants/applicant"],
  ["@/app/home/applicants/_service/emailAction", "@/actions/applicants/email-action"],
  ["@/app/home/applicants/_service/email", "@/actions/applicants/email"],
  ["@/app/home/applicants/_service/types", "@/types/applicants"],
  ["@/app/home/applicants/_service/processTimeline", "@/lib/applicants/process-timeline"],
  ["@/app/home/applicants/_service/query", "@/lib/applicants/query"],
  ["@/app/auth/declined/_service/util", "@/utils/auth/declined"],
  ["@/app/auth/declined/_service/actions", "@/actions/auth/declined"],
  ["@/app/applicant/waiting/_service/util", "@/utils/applicant-waiting"],
  ["@/app/applicant/waiting/_service/action", "@/actions/applicant-waiting/actions"],
  ["@/app/applicant/waiting/_service/type", "@/types/applicant-waiting"],
  ["@/app/applicant/onboarding/_service/action", "@/actions/applicant-onboarding/actions"],
  ["@/app/applicant/onboarding/_service/type", "@/types/applicant-onboarding"],
  ["@/app/home/feeds/_services/action", "@/actions/feeds/post"],
  ["@/app/home/feeds/_services/query", "@/lib/feeds/query"],
  ["@/app/home/feeds/_services/notification-service", "@/lib/feeds/notification-service"],
  ["@/app/home/feeds/_services/types", "@/types/feeds"],
  ["@/app/home/feeds/_services/validation", "@/utils/validations/feeds"],
  ["@/app/home/feeds/_constants", "@/constants/feeds"],
  ["@/app/home/_services/actions", "@/actions/home/codev-promote"],
  ["@/app/home/_hooks/use-user", "@/hooks/home/use-user"],
  ["@/app/home/_hooks/supabase/use-fetch-enum", "@/hooks/home/use-fetch-enum"],
  ["@/app/home/clients/_lib/schema", "@/utils/validations/clients"],
  ["@/app/home/clients/_lib/utils", "@/utils/clients/utils"],
  ["@/hooks/use-kanban-board-sync", "@/hooks/kanban/use-kanban-board-sync"],
  ["@/hooks/use-column-tasks-infinite", "@/hooks/kanban/use-column-tasks-infinite"],
  ["@/hooks/use-member-task-filter", "@/hooks/kanban/use-member-task-filter"],
  ["@/hooks/useKanbanTaskUrlModal", "@/hooks/kanban/useKanbanTaskUrlModal"],
  ["@/hooks/use-modal-kanban", "@/hooks/kanban/use-modal-kanban"],
  ["../_lib/util", "@/utils/dashboard/time-format"],
  ["../_lib/theme", "@/lib/dashboard/theme"],
  ["../_lib/utils", "@/utils/in-house/utils"],
  ["../../tasks/_lib/utils", "@/utils/tasks/time-conversion"],
  ["../../feeds/_services/action", "@/actions/feeds/post"],
  ["../app/home/feeds/_services/query", "@/lib/feeds/query"],
  ["../_service/types", "@/types/applicants"],
  ["../_service/action", "@/actions/applicants/applicant"],
  ["../_service/email", "@/actions/applicants/email"],
  ["../_service/processTimeline", "@/lib/applicants/process-timeline"],
  ["../../_service/types", "@/types/applicants"],
  ["../../_service/action", "@/actions/applicants/applicant"],
  ["../../_service/email", "@/actions/applicants/email"],
  ["../_service/type", "@/types/applicant-waiting"],
  ["../_service/util", "@/utils/applicant-waiting"],
  ["../_services/action", "@/actions/feeds/post"],
  ["./_services/action", "@/actions/feeds/post"],
  ["../_services/query", "@/lib/feeds/query"],
  ["../_services/types", "@/types/feeds"],
  ["../_service/query", "@/lib/applicants/query"],
  ["@/app/home/kanban/[projectId]/_services/query", "@/lib/kanban/sprints-query"],
  ["../_service/actions", "@/actions/auth/onboarding-team"],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|md)$/.test(entry.name)) files.push(full);
  }
  return files;
}

let count = 0;
for (const file of walk(root)) {
  if (file.includes(`${path.sep}scripts${path.sep}update-architecture-imports.mjs`)) continue;
  let content = fs.readFileSync(file, "utf8");
  let next = content;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  if (next !== content) {
    fs.writeFileSync(file, next);
    count++;
  }
}
console.log(`Updated imports in ${count} files`);
