import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const actionsDir = path.join(root, "actions");
const quiet = process.argv.includes("--quiet");

if (process.argv.includes("--help")) {
  console.log("Usage: node scripts/check-authorization.mjs [--quiet]");
  console.log(
    "Fails when a mutation exported from actions/** does not call authorize() or requireIdentity() before touching Supabase.",
  );
  process.exit(0);
}

const PUBLIC = new Set([
  "actions/auth/**",
  "actions/marketing/**",
  "actions/global/auth-declined.ts",
  "actions/global/marketing-profiles.ts",
  "actions/global/nav-user.ts",
  "actions/global/auth-session.ts#signupUser",
  "actions/global/auth-session.ts#signinUser",
  "actions/global/auth-session.ts#resendVerificationEmail",
  "actions/global/nda-storage.ts#uploadNdaToStorage",
  "actions/global/nda-storage.ts#updateCodevNdaUrls",
  "actions/global/nda-storage.ts#completeNdaSigning",
  "actions/global/nda-storage.ts#completeNdaRequest",
  "actions/global/account-settings.ts#checkUsernameAvailability",
  "actions/global/account-settings.ts#getUsernameData",
]);

const MUTATION =
  /\.(?:insert|update|delete|upsert|rpc|upload|remove|move)\s*\(|auth\.updateUser\s*\(|auth\.admin\./;
const DATA_ACCESS = /\.from\(|\.storage\b|\.rpc\(|supabase\.auth\./;
const GUARD = /await\s+(?:authorize|requireIdentity)\s*\(/;

function filesUnder(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...filesUnder(full));
    else if (entry.isFile() && entry.name.endsWith(".ts")) files.push(full);
  }
  return files;
}

function isPublic(relative, name) {
  if (PUBLIC.has(relative)) return true;
  if (PUBLIC.has(`${relative}#${name}`)) return true;
  for (const entry of PUBLIC) {
    if (!entry.endsWith("**")) continue;
    const prefix = entry.slice(0, -2);
    if (relative.startsWith(prefix)) return true;
  }
  return false;
}

function exportsOf(source) {
  const starts = [];
  const pattern = /^export\s+(?:async\s+)?(?:function|const)\s+(\w+)/gm;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    starts.push({ name: match[1], index: match.index });
  }
  return starts.map((start, i) => ({
    name: start.name,
    body: source.slice(start.index, i + 1 < starts.length ? starts[i + 1].index : source.length),
  }));
}

const schemaSource = readFileSync(
  path.join(root, "types/global/supabase.ts"),
  "utf8",
);
const ownershipTables = new Set(["codev"]);
for (const match of schemaSource.matchAll(/^\s{6}(\w+): \{\s*\n\s{8}Row: \{([\s\S]*?)\n\s{8}\}/gm)) {
  const [, table, columns] = match;
  if (/\b(?:codev_id|owner_id|created_by):/.test(columns)) ownershipTables.add(table);
}

const RESOURCE_CHECK = /authorize\(\s*"[^"]+"\s*,\s*\{\s*table:\s*"(\w+)"\s*,\s*id:/g;

let files = 0;
let badResources = 0;
let mutations = 0;
let guarded = 0;
let publicCount = 0;
const failures = [];
const skipped = [];

for (const file of filesUnder(actionsDir).sort()) {
  files += 1;
  const relative = path.relative(root, file).split(path.sep).join("/");
  const source = readFileSync(file, "utf8");

  for (const match of source.matchAll(RESOURCE_CHECK)) {
    const table = match[1];
    if (!ownershipTables.has(table)) {
      badResources += 1;
      failures.push(
        `${relative} passes a resource id for "${table}", which has no ownership column`,
      );
    }
  }

  for (const exported of exportsOf(source)) {
    if (!MUTATION.test(exported.body)) continue;
    mutations += 1;

    if (isPublic(relative, exported.name)) {
      publicCount += 1;
      skipped.push(`${relative}#${exported.name}`);
      continue;
    }

    const guard = exported.body.search(GUARD);
    const access = exported.body.search(DATA_ACCESS);

    if (guard === -1) {
      failures.push(`${relative}#${exported.name} mutates without a guard`);
      continue;
    }

    if (access !== -1 && guard > access) {
      failures.push(`${relative}#${exported.name} touches the database before guarding`);
      continue;
    }

    guarded += 1;
  }
}

if (!quiet) {
  for (const entry of skipped) console.log(`public ${entry}`);
  for (const failure of failures) console.log(`FAIL ${failure}`);
}

console.log(
  `checked=${files} files, mutations=${mutations}, guarded=${guarded}, public=${publicCount}, failed=${failures.length}`,
);

process.exitCode = failures.length > 0 ? 1 : 0;