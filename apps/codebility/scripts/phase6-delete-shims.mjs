import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const shimDirs = [
  "app/(marketing)/profiles/_service",
  "app/(marketing)/profiles/[id]/_services",
  "app/applicant/onboarding/_service",
  "app/applicant/waiting/_service",
  "app/auth/declined/_service",
  "app/home/interns/_lib",
  "app/home/kanban/[projectId]/_services",
  "app/home/kanban/[projectId]/[id]/_services",
  "app/home/my-team/[projectId]/_services",
];

const shimFiles = [
  "app/auth/actions.ts",
  "app/auth/password-reset/action.ts",
  "app/auth/onboarding/_components/Team/actions.ts",
  "app/home/(dashboard)/actions.ts",
  "app/home/account-settings/action.ts",
  "app/home/admin-controls/appointments/actions.ts",
  "app/home/admin-controls/client-tracker/actions.ts",
  "app/home/admin-controls/ticket-support/actions.ts",
  "app/home/clients/action.ts",
  "app/home/hire/actions.ts",
  "app/home/in-house/actions.ts",
  "app/home/kanban/actions.ts",
  "app/home/kanban/ticket/[ticketCode]/actions.ts",
  "app/home/kanban/[projectId]/actions.ts",
  "app/home/kanban/[projectId]/[id]/actions.ts",
  "app/home/my-team/actions.ts",
  "app/home/my-team/[projectId]/actions.ts",
  "app/home/my-team/[projectId]/leaderboard/actions.ts",
  "app/home/my-team/[projectId]/actions/attendance-sync.ts",
  "app/home/my-team/[projectId]/actions/attendance-warnings.ts",
  "app/home/overflow/actions.ts",
  "app/home/projects/actions.ts",
  "app/home/promote-modal/actions.ts",
  "app/home/settings/news-banners/actions.ts",
  "app/home/settings/profile/action.ts",
  "app/home/settings/services/actions.ts",
  "app/home/settings/surveys/actions.ts",
  "app/home/settings/surveys/questions/actions.ts",
  "app/home/settings/surveys/responses/actions.ts",
  "app/home/test-notifications/actions.ts",
  "app/home/ticket-support/actions.ts",
  "hooks/use-column-tasks-infinite.ts",
  "hooks/use-member-task-filter.ts",
  "app/home/in-house/_hooks/use-codev-form.ts",
  "docs/ARCHITECTURE.md",
];

function rm(target) {
  const full = path.join(root, target);
  if (!fs.existsSync(full)) {
    console.log(`skip missing: ${target}`);
    return;
  }
  fs.rmSync(full, { recursive: true, force: true });
  console.log(`removed: ${target}`);
}

for (const dir of shimDirs) rm(dir);
for (const file of shimFiles) rm(file);
