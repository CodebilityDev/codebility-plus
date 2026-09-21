// Compares the plan's pagination-probe locator against the real pager DOM, to
// establish whether the probe can reach the target at all.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-loc");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

await page.goto(`${BASE}/home/in-house`, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(13000);

const out = {};

// Exactly the plan's locator.
const probeLoc = page
  .locator("button,a")
  .filter({ hasText: /^2$/ })
  .filter({ hasNot: page.locator("[disabled]") })
  .last();
out.probeLocatorCount = await probeLoc.count();

// The same but scoped to the pager nav.
const navLoc = page.locator("nav").filter({ hasText: /Previous/ }).last().locator("a", { hasText: /^2$/ });
out.navLocatorCount = await navLoc.count();
out.navLocatorVisible = await navLoc.first().isVisible().catch(() => "err");

// Does it work when clicked?
if (out.navLocatorCount > 0) {
  await navLoc.first().click({ timeout: 10000 }).then(
    () => (out.clicked = true),
    (e) => (out.clicked = String(e).slice(0, 70)),
  );
  await page.waitForTimeout(5000);
  out.after = await page.evaluate(() => {
    const active = [...document.querySelectorAll('[aria-current="page"]')]
      .filter((e) => e.getBoundingClientRect().left > 240)
      .map((e) => e.textContent.trim());
    return {
      active,
      firstRow: document.querySelector("tbody tr")?.innerText.replace(/\s+/g, " ").slice(0, 40) ?? null,
      pulses: document.querySelectorAll(".animate-pulse").length,
    };
  });
}

console.log(JSON.stringify(out, null, 2));
await context.close();
