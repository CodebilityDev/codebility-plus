import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

/** Replace relative action imports when file lives under a route prefix. */
const routeImportRules = [
  {
    prefix: "app/home/account-settings",
    replacements: [
      ['from "../action"', 'from "@/actions/account-settings/actions"'],
    ],
  },
  {
    prefix: "app/auth/password-reset",
    replacements: [
      ['from "../action"', 'from "@/actions/auth/password-reset"'],
    ],
  },
  {
    prefix: "app/home/clients",
    replacements: [
      ['from "../action"', 'from "@/actions/clients/actions"'],
    ],
  },
  {
    prefix: "app/home/settings/profile",
    replacements: [
      ['from "../action"', 'from "@/actions/settings/profile"'],
    ],
  },
  {
    prefix: "app/home/settings/services",
    replacements: [
      ['from "./actions"', 'from "@/actions/settings/services"'],
      ['from "../actions"', 'from "@/actions/settings/services"'],
      ['await import("../actions")', 'await import("@/actions/settings/services")'],
    ],
  },
  {
    prefix: "app/home/(dashboard)",
    replacements: [
      ['from "../actions"', 'from "@/actions/dashboard/actions"'],
    ],
  },
  {
    prefix: "app/home/admin-controls/appointments",
    replacements: [
      ['from "../actions"', 'from "@/actions/admin/appointments"'],
    ],
  },
  {
    prefix: "app/home/admin-controls/client-tracker",
    replacements: [
      ['from "../actions"', 'from "@/actions/admin/client-tracker"'],
    ],
  },
  {
    prefix: "app/home/admin-controls/ticket-support",
    replacements: [
      ['from "./actions"', 'from "@/actions/admin/ticket-support"'],
      ['from "../actions"', 'from "@/actions/admin/ticket-support"'],
    ],
  },
  {
    prefix: "app/home/hire",
    replacements: [
      ['from "../actions"', 'from "@/actions/hire/actions"'],
    ],
  },
  {
    prefix: "app/home/overflow",
    replacements: [
      ['from "../actions"', 'from "@/actions/overflow/actions"'],
    ],
  },
  {
    prefix: "app/home/projects",
    replacements: [
      ['from "../actions"', 'from "@/actions/projects/actions"'],
    ],
  },
  {
    prefix: "app/home/promote-modal",
    replacements: [
      ['from "./actions"', 'from "@/actions/promote-modal/actions"'],
      ['from "../actions"', 'from "@/actions/promote-modal/actions"'],
    ],
  },
  {
    prefix: "app/home/test-notifications",
    replacements: [
      ['from "./actions"', 'from "@/actions/test-notifications/actions"'],
    ],
  },
  {
    prefix: "app/home/ticket-support",
    replacements: [
      ['await import("../actions")', 'await import("@/actions/ticket-support/actions")'],
    ],
  },
  {
    prefix: "app/home/my-team/[projectId]/leaderboard",
    replacements: [
      ['from "./actions"', 'from "@/actions/my-team/leaderboard"'],
    ],
  },
  {
    prefix: "app/home/my-team/[projectId]",
    replacements: [
      ['from "../actions/attendance-sync"', 'from "@/actions/my-team/attendance-sync"'],
      ['from "../actions/attendance-warnings"', 'from "@/actions/my-team/attendance-warnings"'],
      ['from "../actions"', 'from "@/actions/my-team/project"'],
    ],
  },
  {
    prefix: "app/home/my-team",
    replacements: [
      ['from "../actions"', 'from "@/actions/my-team/actions"'],
    ],
  },
  {
    prefix: "app/home/kanban/ticket",
    replacements: [
      ["from './actions'", 'from "@/actions/kanban/ticket"'],
    ],
  },
  {
    prefix: "app/home/kanban/[projectId]/[id]",
    replacements: [
      ['from "../actions"', 'from "@/actions/kanban"'],
    ],
  },
  {
    prefix: "app/home/kanban/[projectId]",
    replacements: [
      ['from "../actions"', 'from "@/actions/kanban/sprints"'],
    ],
  },
  {
    prefix: "app/home/in-house",
    replacements: [
      ['from "../actions"', 'from "@/actions/in-house/actions"'],
    ],
  },
];

const globalReplacements = [
  ['from "@/app/home/clients/_lib/schema"', 'from "@/utils/validations/clients"'],
  ['from "../@/types/applicants"', 'from "@/types/applicants"'],
];

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

  for (const rule of routeImportRules.sort(
    (a, b) => b.prefix.length - a.prefix.length,
  )) {
    if (!rel.startsWith(rule.prefix)) continue;
    for (const [from, to] of rule.replacements) {
      next = next.split(from).join(to);
    }
    break;
  }

  if (next !== content) {
    fs.writeFileSync(file, next);
    count++;
  }
}

console.log(`Phase 5: updated imports in ${count} files`);
