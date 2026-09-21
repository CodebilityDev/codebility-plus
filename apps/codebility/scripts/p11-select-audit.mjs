// Classifies every select("*") by row cardinality.
//   single   -> .single() / .maybeSingle()            (usually fine)
//   count    -> head: true                            (transfers no rows, fine)
//   MULTI    -> returns many rows                     (the real problem)
// Also flags joined relations inside the select, which multiply payload per row.
import fs from "node:fs";
import path from "node:path";

const ROOTS = ["lib", "actions", "app", "hooks", "utils"];
const walk = (d, acc = []) => {
  if (!fs.existsSync(d)) return acc;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (/node_modules|\.next/.test(p)) continue;
      walk(p, acc);
    } else if (/\.(ts|tsx)$/.test(e.name)) acc.push(p);
  }
  return acc;
};

const rows = [];
for (const root of ROOTS) {
  for (const file of walk(path.resolve(root))) {
    const src = fs.readFileSync(file, "utf8");
    const lines = src.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (!/\.select\(\s*["'`]\*/.test(line)) return;
      // Look ahead for the terminator that decides cardinality.
      const tail = lines.slice(i, i + 14).join("\n");
      const isSingle = /\.(single|maybeSingle)\s*\(/.test(tail);
      const isCount = /head:\s*true/.test(tail);
      const isLimit1 = /\.limit\(\s*1\s*\)/.test(tail);
      const hasRange = /\.range\(/.test(tail);
      const table = (line.match(/from\(\s*["'`]([^"'`]+)/) ?? lines.slice(Math.max(0, i - 4), i + 1).join("\n").match(/from\(\s*["'`]([^"'`]+)/) ?? [])[1] ?? "?";
      const kind = isCount ? "count" : isSingle || isLimit1 ? "single" : "MULTI";
      rows.push({
        file: path.relative(process.cwd(), file).split(path.sep).join("/"),
        line: i + 1,
        table,
        kind,
        paginated: hasRange,
      });
    });
  }
}

const multi = rows.filter((r) => r.kind === "MULTI");
const byFile = {};
for (const m of multi) (byFile[m.file] ??= []).push(`${m.table}:${m.line}${m.paginated ? " (paginated)" : ""}`);

console.log(
  JSON.stringify(
    {
      total: rows.length,
      byKind: rows.reduce((a, r) => ((a[r.kind] = (a[r.kind] ?? 0) + 1), a), {}),
      multiRowOffenders: Object.entries(byFile)
        .sort((a, b) => b[1].length - a[1].length)
        .map(([file, hits]) => ({ file, hits })),
    },
    null,
    2,
  ),
);
