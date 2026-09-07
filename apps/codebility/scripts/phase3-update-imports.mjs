import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const replacements = [
  ["@/app/home/projects/actions", "@/actions/projects/actions"],
  ["@/app/home/clients/action", "@/actions/clients/actions"],
  ["@/app/home/hire/actions", "@/actions/hire/actions"],
  ["@/app/home/in-house/actions", "@/actions/in-house/actions"],
  ["@/app/home/overflow/actions", "@/actions/overflow/actions"],
  ["@/app/home/(dashboard)/actions", "@/actions/dashboard/actions"],
  ["@/app/home/account-settings/action", "@/actions/account-settings/actions"],
  ["@/app/home/promote-modal/actions", "@/actions/promote-modal/actions"],
  ["@/app/home/test-notifications/actions", "@/actions/test-notifications/actions"],
  ["@/app/home/ticket-support/actions", "@/actions/ticket-support/actions"],
  ["@/app/home/my-team/actions", "@/actions/my-team/actions"],
  ["@/app/home/my-team/[projectId]/actions", "@/actions/my-team/project"],
  ["@/app/home/my-team/[projectId]/leaderboard/actions", "@/actions/my-team/leaderboard"],
  ["@/app/home/my-team/[projectId]/actions/attendance-sync", "@/actions/my-team/attendance-sync"],
  ["@/app/home/my-team/[projectId]/actions/attendance-warnings", "@/actions/my-team/attendance-warnings"],
  ["@/app/home/kanban/ticket/[ticketCode]/actions", "@/actions/kanban/ticket"],
  ["@/app/home/settings/news-banners/actions", "@/actions/settings/news-banners"],
  ["@/app/home/settings/profile/action", "@/actions/settings/profile"],
  ["@/app/home/settings/services/actions", "@/actions/settings/services"],
  ["@/app/home/settings/surveys/actions", "@/actions/settings/surveys"],
  ["@/app/home/settings/surveys/questions/actions", "@/actions/settings/survey-questions"],
  ["@/app/home/settings/surveys/responses/actions", "@/actions/settings/survey-responses"],
  ["@/app/home/admin-controls/appointments/actions", "@/actions/admin/appointments"],
  ["@/app/home/admin-controls/client-tracker/actions", "@/actions/admin/client-tracker"],
  ["@/app/home/admin-controls/ticket-support/actions", "@/actions/admin/ticket-support"],
  ["@/app/(marketing)/profiles/_service/actions", "@/actions/marketing/profiles"],
  ["@/app/(marketing)/profiles/_service/emailAction", "@/actions/marketing/profiles-email"],
  ["@/app/(marketing)/profiles/[id]/_services/query", "@/lib/marketing/profile-detail-query"],
  ["@/app/home/kanban/[projectId]/[id]/_services/query", "@/lib/kanban/board-page-query"],
  ["@/app/home/my-team/[projectId]/_services/attendanceService", "@/lib/my-team/attendance-service"],
  ["@/app/home/my-team/[projectId]/_services/attendanceServiceClient", "@/lib/my-team/attendance-service-client"],
  ["@/hooks/use-modal", "@/hooks/modals/use-modal"],
  ["@/hooks/use-modal-applicants", "@/hooks/modals/use-modal-applicants"],
  ["@/hooks/use-modal-clients", "@/hooks/modals/use-modal-clients"],
  ["@/hooks/use-modal-users", "@/hooks/modals/use-modal-users"],
  ["@/hooks/use-modal-services", "@/hooks/modals/use-modal-services"],
  ["@/hooks/use-modal-sprints", "@/hooks/modals/use-modal-sprints"],
  ["@/hooks/use-modal-projects", "@/hooks/modals/use-modal-projects"],
  ["@/hooks/use-sidebar", "@/hooks/navigation/use-sidebar"],
  ["@/hooks/useHideSidebarOnResize", "@/hooks/navigation/useHideSidebarOnResize"],
  ["@/hooks/useChangeBgNavigation", "@/hooks/navigation/useChangeBgNavigation"],
  ["@/hooks/useLeaderboard", "@/hooks/leaderboard/useLeaderboard"],
  ["@/hooks/use-kanban-board-sync", "@/hooks/kanban/use-kanban-board-sync"],
  ["@/hooks/use-column-tasks-infinite", "@/hooks/kanban/use-column-tasks-infinite"],
  ["@/hooks/use-member-task-filter", "@/hooks/kanban/use-member-task-filter"],
  ["@/hooks/useKanbanTaskUrlModal", "@/hooks/kanban/useKanbanTaskUrlModal"],
  ["@/hooks/use-modal-kanban", "@/hooks/kanban/use-modal-kanban"],
  ['from "./CodevsRoadmapCard"', 'from "@/components/marketing/CodevsRoadmapCard"'],
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
  if (file.includes(`${path.sep}scripts${path.sep}`)) continue;
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
console.log(`Phase 3: updated imports in ${count} files`);
