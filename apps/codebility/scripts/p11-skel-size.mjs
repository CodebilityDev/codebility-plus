// Measures the skeleton nodes the plan's probe is looking for, mid-flight, and
// reports their actual rendered sizes so we can see why the >=120x24 heuristic
// does or does not match.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/in-house";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-skel");
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
    await new Promise((res) => setTimeout(res, 2500));
  }
  await r.continue();
});

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(12000);

armed = true;
const nextBtn = page
  .locator("button,a")
  .filter({ hasText: /^2$/ })
  .last();
await nextBtn.click({ timeout: 15000 }).catch(() => {});
await page.waitForTimeout(500);

const mid = await page.evaluate(() => {
  const nodes = [...document.querySelectorAll(".animate-pulse")];
  return {
    total: nodes.length,
    sizes: nodes.slice(0, 14).map((e) => {
      const r = e.getBoundingClientRect();
      return `${Math.round(r.width)}x${Math.round(r.height)}`;
    }),
    passFilter: nodes.filter((e) => {
      const r = e.getBoundingClientRect();
      return r.height >= 24 && r.width >= 120;
    }).length,
    tableRows: document.querySelectorAll("tbody tr").length,
    hasSkeletonTable: !!document.querySelector("table"),
  };
});

console.log(JSON.stringify({ route, viewport: "1600x1200", mid }, null, 2));
await context.close();
