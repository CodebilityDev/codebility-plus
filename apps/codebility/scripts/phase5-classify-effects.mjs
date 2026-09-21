// Phase 5 Tier 2 classifier: list every useEffect per route with a heuristic
// verdict, so each can be checked against plan §1a (wrong) / §1b (legitimate).
import fs from "node:fs";
import path from "node:path";

const routes = process.argv.slice(2);
const out = {};

const walk = (dir, acc = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (/\.(tsx|ts)$/.test(e.name)) acc.push(full);
  }
  return acc;
};

// Signals drawn from the plan's own replacement table.
const SIGNALS = [
  { re: /addEventListener|removeEventListener/, verdict: "LEGIT (§1b listener)", why: "document/window event" },
  { re: /IntersectionObserver|ResizeObserver|MutationObserver/, verdict: "LEGIT (§1b observer)", why: "DOM observer" },
  { re: /setInterval/, verdict: "LEGIT (§1b polling)", why: "interval, needs cleanup" },
  { re: /createClient|supabase\.channel|removeChannel|\.subscribe\(/, verdict: "LEGIT (§1b realtime)", why: "Supabase channel" },
  { re: /scrollTo|scrollIntoView|getBoundingClientRect|offsetHeight|clientHeight/, verdict: "LEGIT (§1b measure)", why: "layout measurement" },
  { re: /\.focus\(\)|\.select\(\)/, verdict: "LEGIT (§1b focus)", why: "imperative focus" },
  { re: /await (get|fetch|load|search)[A-Za-z]*\(|await [a-z]+\(.*\)/, verdict: "SUSPECT (§1a fetch)", why: "awaits a call in the effect body" },
  { re: /setTimeout/, verdict: "CHECK (debounce?)", why: "timer; useDeferredValue if debounce" },
  { re: /set[A-Z][A-Za-z]*\(/, verdict: "CHECK (derived?)", why: "sets state; may be derivable" },
];

for (const route of routes) {
  const base = path.resolve("app/home", route);
  if (!fs.existsSync(base)) { out[route] = { error: "missing" }; continue; }
  const files = walk(base);
  const rows = [];

  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    const lines = src.split(/\r?\n/);
    const isClient = /^\s*["']use client["']/m.test(src);
    lines.forEach((line, i) => {
      if (!/useEffect\(/.test(line)) return;
      // Take the next 22 lines as the effect body for signal matching.
      const body = lines.slice(i, i + 22).join("\n");
      const hits = SIGNALS.filter((s) => s.re.test(body));
      rows.push({
        file: path.relative(path.resolve("app/home"), f).split(path.sep).join("/"),
        line: i + 1,
        client: isClient,
        verdicts: hits.length ? [...new Set(hits.map((h) => h.verdict))] : ["UNCLASSIFIED"],
        reasons: hits.length ? [...new Set(hits.map((h) => h.why))] : ["no signal matched"],
      });
    });
  }

  const tally = {};
  for (const r of rows) for (const v of r.verdicts) tally[v] = (tally[v] ?? 0) + 1;

  out[route] = { totalEffects: rows.length, tally, rows };
}

console.log(JSON.stringify(out, null, 2));
