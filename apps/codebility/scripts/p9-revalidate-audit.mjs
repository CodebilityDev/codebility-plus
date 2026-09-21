// Accurate inventory of mutating action files that never invalidate any cache.
// Knows about the kanban wrapper (revalidateKanbanBoardLists) so it does not
// report a false positive for files that revalidate through a helper.
import fs from "node:fs";
import path from "node:path";

const ROOT = "actions";

const REVALIDATORS =
  /revalidatePath|revalidateTag|revalidateKanbanBoardLists|revalidate[A-Z][A-Za-z]*\(/;

const walk = (dir, acc = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.name.endsWith(".ts")) acc.push(p);
  }
  return acc;
};

const rows = [];
for (const file of walk(ROOT)) {
  const src = fs.readFileSync(file, "utf8");
  const mutations = (src.match(/\.(insert|update|upsert|delete)\(/g) ?? []).length;
  if (mutations === 0) continue;

  const revalidates = REVALIDATORS.test(src);
  rows.push({
    file: file.split(path.sep).join("/"),
    mutations,
    revalidates,
  });
}

const missing = rows.filter((r) => !r.revalidates);
const covered = rows.filter((r) => r.revalidates);

console.log(`mutating action files: ${rows.length}`);
console.log(`  with invalidation:   ${covered.length}`);
console.log(`  WITHOUT:             ${missing.length}`);
console.log("");
if (missing.length) {
  console.log("Files with mutations but no cache invalidation:");
  for (const r of missing) {
    console.log(`  ${r.file}  (${r.mutations} mutations)`);
  }
}
