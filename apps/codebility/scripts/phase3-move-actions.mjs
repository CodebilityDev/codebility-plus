import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");

const actionMoves = [
  ["app/home/(dashboard)/actions.ts", "actions/dashboard/actions.ts"],
  ["app/home/account-settings/action.ts", "actions/account-settings/actions.ts"],
  ["app/home/admin-controls/appointments/actions.ts", "actions/admin/appointments.ts"],
  ["app/home/admin-controls/client-tracker/actions.ts", "actions/admin/client-tracker.ts"],
  ["app/home/admin-controls/ticket-support/actions.ts", "actions/admin/ticket-support.ts"],
  ["app/home/clients/action.ts", "actions/clients/actions.ts"],
  ["app/home/hire/actions.ts", "actions/hire/actions.ts"],
  ["app/home/in-house/actions.ts", "actions/in-house/actions.ts"],
  ["app/home/overflow/actions.ts", "actions/overflow/actions.ts"],
  ["app/home/projects/actions.ts", "actions/projects/actions.ts"],
  ["app/home/promote-modal/actions.ts", "actions/promote-modal/actions.ts"],
  ["app/home/settings/news-banners/actions.ts", "actions/settings/news-banners.ts"],
  ["app/home/settings/profile/action.ts", "actions/settings/profile.ts"],
  ["app/home/settings/services/actions.ts", "actions/settings/services.ts"],
  ["app/home/settings/surveys/actions.ts", "actions/settings/surveys.ts"],
  ["app/home/settings/surveys/questions/actions.ts", "actions/settings/survey-questions.ts"],
  ["app/home/settings/surveys/responses/actions.ts", "actions/settings/survey-responses.ts"],
  ["app/home/test-notifications/actions.ts", "actions/test-notifications/actions.ts"],
  ["app/home/ticket-support/actions.ts", "actions/ticket-support/actions.ts"],
  ["app/home/my-team/actions.ts", "actions/my-team/actions.ts"],
  ["app/home/my-team/[projectId]/actions.ts", "actions/my-team/project.ts"],
  ["app/home/my-team/[projectId]/leaderboard/actions.ts", "actions/my-team/leaderboard.ts"],
  ["app/home/my-team/[projectId]/actions/attendance-sync.ts", "actions/my-team/attendance-sync.ts"],
  ["app/home/my-team/[projectId]/actions/attendance-warnings.ts", "actions/my-team/attendance-warnings.ts"],
  ["app/home/kanban/ticket/[ticketCode]/actions.ts", "actions/kanban/ticket.ts"],
  ["app/(marketing)/profiles/_service/actions.ts", "actions/marketing/profiles.ts"],
  ["app/(marketing)/profiles/_service/emailAction.ts", "actions/marketing/profiles-email.ts"],
  ["app/(marketing)/profiles/[id]/_services/query.ts", "lib/marketing/profile-detail-query.ts"],
  ["app/(marketing)/profiles/_service/template/hire-codev-template.ts", "lib/marketing/hire-codev-template.ts"],
  ["app/home/kanban/[projectId]/[id]/_services/query.ts", "lib/kanban/board-page-query.ts"],
  ["app/home/my-team/[projectId]/_services/attendanceService.ts", "lib/my-team/attendance-service.ts"],
  ["app/home/my-team/[projectId]/_services/attendanceServiceClient.ts", "lib/my-team/attendance-service-client.ts"],
];

for (const [from, to] of actionMoves) {
  const fromPath = path.join(root, from);
  const toPath = path.join(root, to);
  if (!fs.existsSync(fromPath)) {
    console.warn(`Skip missing: ${from}`);
    continue;
  }
  fs.mkdirSync(path.dirname(toPath), { recursive: true });
  execSync(`git mv "${fromPath.replace(/\\/g, "/")}" "${toPath.replace(/\\/g, "/")}"`, {
    cwd: root,
    stdio: "inherit",
  });
  const exportPath = `@/${to.replace(/\.ts$/, "").replace(/\\/g, "/")}`;
  fs.mkdirSync(path.dirname(fromPath), { recursive: true });
  fs.writeFileSync(fromPath, `export * from "${exportPath}";\n`);
  console.log(`Moved ${from} -> ${to}`);
}

console.log("Phase 3 file moves complete");
