// The announcement UI has no /home/announcements route; it opens from the
// navbar button on any /home page. This exercises that real path.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P9_BASE ?? "http://localhost:3000";
const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p9-ann-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

const errors = [];
const consoleErrors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
});

await page.goto(BASE + "/home", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(7000);

// The announcement trigger is the bell/announcement control in the navbar.
const before = await page.locator('[role="dialog"]').count();

const trigger = page
  .locator("button")
  .filter({ has: page.locator("svg") })
  .nth(0);

// Try the specific announcement button by its aria/title, else fall back.
let opened = false;
for (const sel of [
  'button[title*="nnouncement" i]',
  'button[aria-label*="nnouncement" i]',
  'button[title*="ell" i]',
]) {
  const el = page.locator(sel).first();
  if (await el.count()) {
    await el.click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(3500);
    opened = true;
    break;
  }
}

const after = await page.locator('[role="dialog"]').count();
const dialogText = after
  ? (await page.locator('[role="dialog"]').first().textContent().catch(() => "")) ?? ""
  : "";

console.log(
  JSON.stringify(
    {
      dialogsBefore: before,
      dialogsAfter: after,
      openedViaSelector: opened,
      dialogTextSample: dialogText.replace(/\s+/g, " ").slice(0, 260),
      pageErrors: errors,
      consoleErrors: consoleErrors.filter((t) =>
        /announce|modal|error/i.test(t),
      ),
    },
    null,
    2,
  ),
);
await context.close();
