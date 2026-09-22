// Audits every server action and API route for an authorization guard before
// it mutates. With RLS disabled, a mutation with no guard is unprotected.
//
// Heuristic, not a proof: it looks for a guard call anywhere in the same file
// before the first write, and flags files that write with no guard at all. Use
// it to build a shortlist for human review, not as a verdict.
//
// Usage: node scripts/audit-guards.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "actions");
const API = path.join(process.cwd(), "app", "api");

const GUARDS = [
  "requireUser",
  "requireRole",
  "requireProjectMember",
  "requireSelfOrRole",
  "createAdminClient",
  // Inline patterns used instead of the auth-guard helpers. These authenticate
  // and authorize in place, so they count as guarded.
  "cachedUser",
  "getCachedUser",
  "auth.getUser()",
];

// Inline authorization markers: a role check, or an explicit denial branch.
const INLINE_AUTH = [
  /role_id\s*!==?\s*1/,
  /role_id\s*===?\s*1/,
  /Admin access required/,
  /isAdmin/,
  /roleId\s*!==?\s*1/,
  /roleId\s*===?\s*1/,
];

// Supabase write operations, and fetch calls to mutating methods.
const WRITE_PATTERNS = [
  /\.insert\s*\(/,
  /\.update\s*\(/,
  /\.upsert\s*\(/,
  /\.delete\s*\(/,
  /method:\s*["'](POST|PUT|PATCH|DELETE)["']/i,
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const files = [...walk(ROOT), ...walk(API)];

const findings = [];

for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const rel = path.relative(process.cwd(), file);

  // Skip pure presentational / config files.
  if (/templates[\\/]|config\.ts$|types\.ts$|^index\.ts$/.test(rel)) continue;

  const hasGuard =
    GUARDS.some((g) => src.includes(g)) ||
    INLINE_AUTH.some((re) => re.test(src));

  // Find all write sites with their offsets.
  const writeOffsets = [];
  for (const re of WRITE_PATTERNS) {
    const rx = new RegExp(re.source, "g");
    let m;
    while ((m = rx.exec(src)) !== null) writeOffsets.push(m.index);
  }
  if (writeOffsets.length === 0) continue;

  // Note "use server" files only: client components can't call these directly.
  const isServer = /["']use server["']/.test(src) || rel.includes("api");

  // Earliest guard offset (if any) vs earliest write offset.
  const guardMarkers = [
    ...GUARDS.map((g) => src.indexOf(g)),
    ...INLINE_AUTH.map((re) => src.search(re)),
  ].filter((i) => i !== -1);
  const guardOffset = guardMarkers.length ? Math.min(...guardMarkers) : -1;

  const firstWrite = Math.min(...writeOffsets);

  // Guard after the first write is suspicious; no guard at all is worse.
  if (guardOffset === -1) {
    findings.push({ rel, severity: "NO GUARD", writes: writeOffsets.length, note: "" });
  } else if (guardOffset > firstWrite) {
    findings.push({
      rel,
      severity: "GUARD AFTER WRITE",
      writes: writeOffsets.length,
      note: `first guard at byte ${guardOffset}, first write at ${firstWrite}`,
    });
  }
}

const noGuard = findings.filter((f) => f.severity === "NO GUARD");
const late = findings.filter((f) => f.severity === "GUARD AFTER WRITE");

console.log(`scanned ${files.length} files\n`);

console.log(`=== NO GUARD AT ALL (${noGuard.length}) ===`);
for (const f of noGuard.sort((a, b) => b.writes - a.writes)) {
  console.log(`  ${f.rel}  (${f.writes} write sites)`);
}

console.log(`\n=== GUARD APPEARS AFTER A WRITE (${late.length}) ===`);
for (const f of late) console.log(`  ${f.rel}  ${f.note}`);

console.log(`\n${noGuard.length + late.length} files need review`);
