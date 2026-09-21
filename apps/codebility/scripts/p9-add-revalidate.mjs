// One-off: insert revalidatePath before the success returns in hire actions.
import fs from "node:fs";

const path = "actions/hire/actions.ts";
const lines = fs.readFileSync(path, "utf8").split(/\r?\n/);

// Success return line numbers (1-indexed) in the original file, applied
// bottom-up so earlier insertions do not shift them.
const targets = [408, 341, 282, 201, 109];
const CALL = 'revalidatePath("/home/hire");';

for (const t of targets) {
  const idx = t - 1;
  const indent = (lines[idx].match(/^\s*/) ?? [""])[0];
  lines.splice(idx, 0, `${indent}${CALL}`, "");
}

fs.writeFileSync(path, lines.join("\n"), "utf8");
console.log("inserted", targets.length, "calls");
