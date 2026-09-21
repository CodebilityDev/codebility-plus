// Polls the DOM across the whole page-change flight, so we can see exactly when
// (and whether) the skeleton replaces the table. Prints a timeline instead of a
// single sample, because a single sample cannot tell "never happened" from
// "happened between samples".
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/in-house";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-timeline");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

let armed = false;
await page.route("**/*", async (r) => {
  const req = r.request();
  if (armed && req.method() === "POST" && req.headers()["next-action"]) {
    await new Promise((res) => setTimeout(res, 3000));
  }
  await r.continue();
});

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(12000);

const sample = () =>
  page.evaluate(() => {
    const pulses = [...document.querySelectorAll(".animate-pulse")];
    const visibleBlocks = pulses.filter((e) => {
      const r = e.getBoundingClientRect();
      return r.height >= 24 && r.width >= 120;
    }).length;
    const anySized = pulses.filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }).length;
    const marked = [...document.querySelectorAll('[aria-current="page"],[aria-current="true"]')]
      .filter((e) => e.getBoundingClientRect().left > 240)
      .map((e) => (e.textContent || "").trim())
      .find((t) => /^\d+$/.test(t));
    return {
      page: marked ?? null,
      pulses: pulses.length,
      sizedPulses: anySized,
      bigBlocks: visibleBlocks,
      rows: document.querySelectorAll("tbody tr").length,
      hasSkeletonTable: pulses.length > 0,
    };
  });

armed = true;
const t0 = Date.now();
await page
  .locator("button,a")
  .filter({ hasText: /^2$/ })
  .last()
  .click({ timeout: 15000 })
  .catch(() => {});

const timeline = [];
for (let i = 0; i < 24; i++) {
  await page.waitForTimeout(200);
  const s = await sample();
  timeline.push({ at: `${Date.now() - t0}ms`, ...s });
  if (i > 4 && s.pulses === 0 && s.page === "2") break;
}

console.log(JSON.stringify({ route, timeline }, null, 2));
await context.close();
