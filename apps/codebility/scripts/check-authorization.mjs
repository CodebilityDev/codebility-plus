import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const actionsDir = path.join(root, "actions");
const quiet = process.argv.includes("--quiet");

if (process.argv.includes("--help")) {
  console.log("Usage: node scripts/check-authorization.mjs [--quiet]");
  process.exit(0);
}

const PUBLIC = new Set([
  "actions/global/nda-storage.ts",
  "actions/marketing/careers/job-application.ts",
  "actions/marketing/contact/contact-appointment.ts",
  "actions/global/permissions.ts",
  "actions/global/current-user.ts",
  "actions/global/nav-user.ts",
  "actions/global/marketing-profiles.ts",
  "actions/global/auth-declined.ts",
  "actions/auth/onboarding/onboarding-team.ts",
]);

const EXPORT = /^export\s+(?:(?:async\s+)?function|const\s+\w+\s*=\s*async)\s+(\w+)/gm;
const GUARD = /\b(?:authorize|requireIdentity)\s*\(/;
const READ = /^(get|list|search|find|read)/i;
const MUTATION_PREFIX =
  /^(create|update|delete|upsert|upload|save|complete|pass|deny|accept|move|reset|sync|add|remove|mark|submit|take|ensure)/i;

function filesUnder(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...filesUnder(full));
    else if (entry.isFile() && entry.name.endsWith(".ts")) files.push(full);
  }
  return files;
}

function isMutation(name) {
  if (name.includes("Action") || MUTATION_PREFIX.test(name)) return true;
  return !READ.test(name);
}

let checked = 0;
let guarded = 0;
let publicCount = 0;
let failed = 0;
const skipped = [];
const failures = [];

for (const file of filesUnder(actionsDir).sort()) {
  checked += 1;
  const relative = path.relative(root, file).split(path.sep).join("/");

  if (PUBLIC.has(relative)) {
    publicCount += 1;
    skipped.push(relative);
    continue;
  }

  const source = readFileSync(file, "utf8");

  if (GUARD.test(source)) {
    guarded += 1;
    continue;
  }

  const mutations = [...source.matchAll(EXPORT)]
    .map((match) => match[1])
    .filter(isMutation);

  if (mutations.length > 0) {
    failed += 1;
    failures.push(
      `${relative} ${mutations.length} unguarded mutation(s): ${mutations.join(", ")}`,
    );
  }
}

if (!quiet) {
  for (const relative of skipped) console.log(`${relative} skipped`);
  for (const line of failures) console.log(line);
}

console.log(
  `checked=${checked} files, guarded=${guarded}, public=${publicCount}, failed=${failed}`,
);

process.exitCode = failed > 0 ? 1 : 0;