// One-off: re-measure the effect counts using the ORIGINAL audit classifier
// (without the DEFINITELY_LEGIT override) so the reported reduction can be
// attributed honestly rather than resting on a change to the tracker itself.
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

let total = 0;
const fetchers = [];
const byVerdict = {};

for (const root of ROOTS) {
  for (const file of walk(path.resolve(root))) {
    const rel = path.relative(process.cwd(), file).split(path.sep).join("/");
    const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
    lines.forEach((l, i) => {
      if (!/useEffect\(/.test(l)) return;
      total++;
      if (EXCLUDE.test(rel)) return;
      const body = lines.slice(i, i + 26).join("\n");
      const fetches = FETCH_SIGNALS.test(body);
      const legit = LEGIT.test(body);
      const verdict = fetches ? (legit ? "MIXED" : "FETCH") : legit ? "legit" : "review";
      byVerdict[verdict] = (byVerdict[verdict] ?? 0) + 1;
      if (/FETCH|MIXED/.test(verdict)) fetchers.push(`${rel}:${i + 1}`);
    });
  }
}

const byFile = {};
for (const f of fetchers) {
  const [file] = f.split(":");
  (byFile[file] ??= []).push(f);
}

console.log(
  JSON.stringify(
    {
      totalEffects: total,
      byVerdict,
      dataFetchingEffects: fetchers.length,
      files: byFile,
    },
    null,
    2,
  ),
);
