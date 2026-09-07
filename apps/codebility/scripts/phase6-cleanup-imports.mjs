import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const globalReplacements = [
  ['from "../projects/actions"', 'from "@/actions/projects/actions"'],
  ['from "../../projects/actions"', 'from "@/actions/projects/actions"'],
  ['from "../../../projects/actions"', 'from "@/actions/projects/actions"'],
  ['from "./promote-modal/actions"', 'from "@/actions/promote-modal/actions"'],
  ['from "../home/settings/services/actions"', 'from "@/actions/settings/services"'],
  ['from "../../settings/surveys/questions/actions"', 'from "@/actions/settings/survey-questions"'],
  ['from "../../settings/surveys/responses/actions"', 'from "@/actions/settings/survey-responses"'],
  ['from "../../questions/actions"', 'from "@/actions/settings/survey-questions"'],
  ['from "../../responses/actions"', 'from "@/actions/settings/survey-responses"'],
  ['from "../settings/surveys/actions"', 'from "@/actions/settings/surveys"'],
  ['from "../settings/surveys/questions/actions"', 'from "@/actions/settings/survey-questions"'],
  ['from "../questions/actions"', 'from "@/actions/settings/survey-questions"'],
  ['from "../leaderboard/actions"', 'from "@/actions/my-team/leaderboard"'],
  ['from "../../auth/actions"', 'from "@/actions/auth"'],
  ['from "../[projectId]/actions"', 'from "@/actions/kanban/sprints"'],
  ['from "@/app/home/kanban/[projectId]/[id]/actions"', 'from "@/actions/kanban"'],
];

const authActionFiles = new Set([
  "app/auth/sign-in/_components/SignInForm.tsx",
  "app/auth/sign-up/_components/SignUpForm.tsx",
]);

const kanbanTaskFiles = new Set([
  "app/home/kanban/[projectId]/[id]/_components/tasks/TaskViewModal.tsx",
  "app/home/kanban/[projectId]/[id]/_components/tasks/TaskDeleteModal.tsx",
  "app/home/kanban/[projectId]/[id]/_components/tasks/TaskAddModal.tsx",
  "app/home/kanban/[projectId]/[id]/_components/kanban_modals/MobileTaskMoveModal.tsx",
  "app/home/kanban/[projectId]/[id]/_components/kanban_modals/KanbanAddModalMembers.tsx",
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function normalizeRel(filePath) {
  return filePath.split(path.sep).join("/");
}

let count = 0;
for (const file of walk(root)) {
  if (file.includes(`${path.sep}scripts${path.sep}`)) continue;
  const rel = normalizeRel(path.relative(root, file));
  let content = fs.readFileSync(file, "utf8");
  let next = content;

  for (const [from, to] of globalReplacements) {
    next = next.split(from).join(to);
  }

  if (authActionFiles.has(rel)) {
    next = next.split('from "../../actions"').join('from "@/actions/auth"');
  }

  if (kanbanTaskFiles.has(rel)) {
    next = next.split('from "../../actions"').join('from "@/actions/kanban"');
  }

  if (rel === "app/home/hire/applications/[jobId]/client-page.tsx") {
    next = next.split('from "../../actions"').join('from "@/actions/hire/actions"');
  }

  if (next !== content) {
    fs.writeFileSync(file, next);
    count++;
  }
}

console.log(`Cleanup imports: updated ${count} files`);
