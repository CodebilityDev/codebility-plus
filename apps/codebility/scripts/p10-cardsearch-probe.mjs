// Search probe for card-grid routes (no tbody). Counts rendered cards and
// reports whether the term changed them and whether a server request fired.
// Usage: P10_BASE=... node scripts/p10-cardsearch-probe.mjs /home/overflow <term>
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/overflow";
const TERM = process.argv[3] ?? "zzz";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p10-cardsearch");
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
});

// Cards are whichever element carries the question title; count the largest
// repeating block that contains text, which is layout-independent.
const cardTexts = () =>
  page.evaluate(() => {
    const seen = new Set();
    const out = [];
    for (const el of document.querySelectorAll("article, [class*='rounded'] > div")) {
      const t = (el.innerText || "").replace(/\s+/g, " ").trim();
      if (t.length < 20 || t.length > 400) continue;
      const key = t.slice(0, 60);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(key);
    }
    return out;
  });

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(14000);

const search = page.locator('input[placeholder*="earch" i]:visible').first();
const found = (await search.count()) > 0 && (await search.isVisible().catch(() => false));

const before = await cardTexts();
reqs.length = 0;
let after = before;

if (found) {
  await search.click();
  await search.pressSequentially(TERM, { delay: 90 });
  await page.waitForTimeout(6000);
  after = await cardTexts();
}

const removed = before.filter((t) => !after.includes(t));

console.log(
  JSON.stringify(
    {
      route,
      searchFound: found,
      term: TERM,
      cardsBefore: before.length,
      cardsAfter: after.length,
      requestsTotal: reqs.length,
      cardsRemoved: removed.length,
      firstRemoved: removed[0] ?? null,
      pageErrors: errors,
    },
    null,
    2,
  ),
);
await context.close();
