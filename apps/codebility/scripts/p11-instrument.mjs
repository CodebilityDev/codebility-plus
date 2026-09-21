// Reads the instrumented component state (window.__p11) during the flight, so
// we can see whether showSkeleton is actually true when the skeleton is on
// screen, and what the hook reports.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-inst");
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

const read = () =>
  page.evaluate(() => ({
    p11: window.__p11 ?? null,
    pulses: document.querySelectorAll(".animate-pulse").length,
    visibleRows: [...document.querySelectorAll("tbody tr")].filter((t) => t.getBoundingClientRect().height > 0).length,
  }));

console.log("BEFORE", JSON.stringify(await read()));

armed = true;
await page.locator("nav").filter({ hasText: /Previous/ }).last().locator("a", { hasText: /^2$/ }).first().click({ timeout: 15000 });

for (let i = 0; i < 8; i++) {
  await page.waitForTimeout(300);
  console.log(`${(i + 1) * 300}ms`, JSON.stringify(await read()));
}

await page.waitForTimeout(6000);
console.log("SETTLED", JSON.stringify(await read()));
await context.close();
