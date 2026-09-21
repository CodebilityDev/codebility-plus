// Samples rapidly right after the click with the response delayed, reporting
// showSkeleton-relevant DOM state, to see whether the skeleton engages on a
// key change and why the plan's probe (single 350ms sample) misses it.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-flight");
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

const snap = () =>
  page.evaluate(() => {
    const pulses = [...document.querySelectorAll(".animate-pulse")];
    const big = pulses.filter((e) => {
      const r = e.getBoundingClientRect();
      return r.height >= 24 && r.width >= 120;
    }).length;
    const sized = pulses.filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }).length;
    const active = [...document.querySelectorAll('[aria-current="page"]')]
      .filter((e) => e.getBoundingClientRect().left > 240)
      .map((e) => e.textContent.trim());
    return {
      active: active[0] ?? null,
      pulses: pulses.length,
      sizedPulses: sized,
      bigBlocks: big,
      rows: document.querySelectorAll("tbody tr").length,
    };
  });

console.log("BEFORE", JSON.stringify(await snap()));

armed = true;
const nav = page.locator("nav").filter({ hasText: /Previous/ }).last();
await nav.locator("a", { hasText: /^2$/ }).first().click({ timeout: 15000 });

const timeline = [];
for (let i = 0; i < 16; i++) {
  await page.waitForTimeout(150);
  timeline.push({ at: `${(i + 1) * 150}ms`, ...(await snap()) });
}

console.log("TIMELINE");
for (const t of timeline) console.log(" ", JSON.stringify(t));
await context.close();
