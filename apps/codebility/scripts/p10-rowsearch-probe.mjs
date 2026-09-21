// Settles the Phase 10 §2.1 question: does a filter change the rows the user
// sees? Types a term that must match a real record and compares row identity,
// not just the count. Usage: P10_BASE=... node scripts/p10-rowsearch-probe.mjs /home/in-house <term>
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/in-house";
const TERM = process.argv[3] ?? "a";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p10-rowsearch");
fs.rmSync(PROFILE, { recursive: true, force: true });
if (fs.existsSync(SHARED)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));

const reqs = [];
page.on("request", (r) => {
  const h = r.headers();
  if (r.method() === "POST" && h["next-action"]) reqs.push("action");
  else if (/\/api\//.test(r.url())) reqs.push("api");
});

const rowTexts = () =>
  page.evaluate(() =>
    [...document.querySelectorAll("tbody tr")].map((r) => r.innerText.replace(/\s+/g, " ").slice(0, 70)),
  );

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(12000);

const search = page.locator('input[placeholder*="earch" i]:visible').first();
const found = (await search.count()) > 0 && (await search.isVisible().catch(() => false));

const before = await rowTexts();
reqs.length = 0;
let after = before;

if (found) {
  await search.click();
  await search.pressSequentially(TERM, { delay: 90 });
  await page.waitForTimeout(6000);
  after = await rowTexts();
}

const norm = (a) => a.map((s) => s.replace(/\s+/g, " "));
const [b, a] = [norm(before), norm(after)];

console.log(
  JSON.stringify(
    {
      route,
      searchFound: found,
      term: TERM,
      rowsBefore: b.length,
      rowsAfter: a.length,
      requestsTotal: reqs.length,
      firstRowBefore: b[0] ?? null,
      firstRowAfter: a[0] ?? null,
      rowsChanged: JSON.stringify(b) !== JSON.stringify(a),
      everyRowMatchesTerm: a.length > 0 && a.every((t) => t.toLowerCase().includes(TERM.toLowerCase())),
      pageErrors: errors,
    },
    null,
    2,
  ),
);
await context.close();
