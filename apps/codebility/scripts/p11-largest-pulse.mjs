// Lists the largest visible .animate-pulse nodes mid-flight, so we can decide
// whether the skeleton genuinely lacks a large block or the probe's single
// 350ms sample is landing at the wrong moment.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-largest");
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
    await new Promise((res) => setTimeout(res, 4000));
  }
  await r.continue();
});

await page.goto(`${BASE}/home/in-house`, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(13000);

armed = true;
await page.locator("nav").filter({ hasText: /Previous/ }).last().locator("a", { hasText: /^2$/ }).first().click({ timeout: 15000 });
await page.waitForTimeout(900);

const info = await page.evaluate(() => {
  const nodes = [...document.querySelectorAll(".animate-pulse")]
    .map((e) => {
      const r = e.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    })
    .filter((n) => n.w > 0 && n.h > 0)
    .sort((a, b) => b.w * b.h - a.w * a.h);
  return {
    sized: nodes.length,
    largest: nodes.slice(0, 12),
    passingHeuristic: nodes.filter((n) => n.h >= 24 && n.w >= 120).length,
    // Are there any visible table rows from the previous page?
    visibleRows: [...document.querySelectorAll("tbody tr")].filter((tr) => tr.getBoundingClientRect().height > 0).length,
    anyTable: !!document.querySelector("table"),
  };
});

console.log(JSON.stringify(info, null, 2));
await context.close();
