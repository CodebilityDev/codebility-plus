// Strong filter test: applies two DIFFERENT filter values and requires the two
// result sets to differ. Comparing one filter against the unfiltered list is a
// weak assertion, because the top rows can legitimately be identical.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/in-house";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-disc-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(13000);

const rowSet = () =>
  page.evaluate(() =>
    [...document.querySelectorAll("tbody tr")].map((r) =>
      r.innerText.replace(/\s+/g, " ").slice(0, 34),
    ),
  );

const pick = async (index) => {
  const combo = page.locator('[role="combobox"]:visible').first();
  await combo.click();
  await page.waitForTimeout(1000);
  const opts = page.locator('[role="option"]:visible');
  const label = ((await opts.nth(index).innerText().catch(() => "")) || "").trim();
  await opts.nth(index).click();
  await page.waitForTimeout(6000);
  return { label, rows: await rowSet() };
};

const unfiltered = await rowSet();
const a = await pick(1); // TRAINING
const b = await pick(3); // MENTOR - a deliberately different, smaller cohort

const same = (x, y) => JSON.stringify(x) === JSON.stringify(y);

console.log(
  JSON.stringify(
    {
      route,
      unfilteredCount: unfiltered.length,
      filterA: { label: a.label, count: a.rows.length, first: a.rows[0] ?? null },
      filterB: { label: b.label, count: b.rows.length, first: b.rows[0] ?? null },
      aEqualsUnfiltered: same(a.rows, unfiltered),
      bEqualsUnfiltered: same(b.rows, unfiltered),
      aEqualsB: same(a.rows, b.rows),
      verdict: same(a.rows, b.rows)
        ? `FAIL: "${a.label}" and "${b.label}" returned identical rows - filter not applied`
        : "PASS: different filter values produce different result sets",
      pageErrors: errors,
    },
    null,
    2,
  ),
);
await context.close();
