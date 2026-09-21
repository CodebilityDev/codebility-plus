// Classifies every useEffect under app/home + components, flags data-fetching
// ones, and reports per-route totals. Read-only.
import fs from "node:fs";
import path from "node:path";

const ROOTS = ["app/home", "components", "hooks", "store"];
const EXCLUDE = /(^|[\\/])kanban([\\/]|$)/;

const FETCH_SIGNALS =
  /await\s+(fetch|get[A-Z]|fetch[A-Z]|load[A-Z]|search[A-Z]|check[A-Z]|count[A-Z]|list[A-Z])|\.then\(|supabase\s*\.\s*from\(|createClientClientComponent/;
const LEGIT =
  /addEventListener|removeEventListener|IntersectionObserver|ResizeObserver|MutationObserver|setInterval|supabase\.channel|removeChannel|\.subscribe\(|matchMedia|localStorage|sessionStorage|document\.|window\.|requestAnimationFrame|\.focus\(\)/;

const walk = (d, acc = []) => {
  if (!fs.existsSync(d)) return acc;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(tsx|ts)$/.test(e.name)) acc.push(p);
  }
  return acc;
};

const rows = [];
for (const root of ROOTS) {
  for (const file of walk(path.resolve(root))) {
    const rel = path.relative(process.cwd(), file).split(path.sep).join("/");
    const src = fs.readFileSync(file, "utf8");
    const lines = src.split(/\r?\n/);
    lines.forEach((l, i) => {
      if (!/useEffect\(/.test(l)) return;
      const body = lines.slice(i, i + 26).join("\n");
      const fetches = FETCH_SIGNALS.test(body);
      const legit = LEGIT.test(body);
      rows.push({
        file: rel,
        line: i + 1,
        kanban: EXCLUDE.test(rel),
        verdict: fetches ? (legit ? "MIXED" : "FETCH") : legit ? "legit" : "review",
      });
    });
  }
}

const byVerdict = {};
for (const r of rows) byVerdict[r.verdict] = (byVerdict[r.verdict] ?? 0) + 1;

const fetchers = rows.filter((r) => /FETCH|MIXED/.test(r.verdict) && !r.kanban);
const byFile = {};
for (const f of fetchers) (byFile[f.file] ??= []).push(f.line);

console.log(
  JSON.stringify(
    {
      totalEffects: rows.length,
      excludedKanban: rows.filter((r) => r.kanban).length,
      byVerdict,
      dataFetchingEffects: fetchers.length,
      files: Object.entries(byFile)
        .sort((a, b) => b[1].length - a[1].length)
        .map(([f, l]) => ({ file: f, lines: l })),
    },
    null,
    2,
  ),
);
