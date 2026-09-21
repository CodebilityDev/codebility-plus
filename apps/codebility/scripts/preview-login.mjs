// Opens the production preview in a dedicated Playwright profile and waits for
// sign-in, so later probes can navigate it authenticated.
// Leaves the browser open until closed.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-22ly08bdz-zeff01s-projects.vercel.app";
const TIMEOUT_MS = Number(process.env.LOGIN_TIMEOUT_MS ?? 600000);

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

// Separate profile from the localhost probes: different origin, so a different
// cookie jar. Never reused across environments.
const PROFILE = path.join(os.tmpdir(), "codebility-vercel-profile");
fs.mkdirSync(PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1500, height: 1000 },
});
const page = context.pages()[0] ?? (await context.newPage());

await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 180000 });
console.log(`Opened ${page.url()}`);
console.log("Sign in in the opened window. Waiting...");

const deadline = Date.now() + TIMEOUT_MS;
let signedIn = false;

while (Date.now() < deadline) {
  await page.waitForTimeout(3000);
  try {
    const url = page.url();
    const hasUserMenu = await page
      .locator('[aria-label*="user menu" i]')
      .count();
    if (!/\/auth\//.test(url) && hasUserMenu > 0) {
      console.log(`SIGNED IN. URL: ${url}`);
      signedIn = true;
      break;
    }
  } catch {
    // Navigation in flight.
  }
}

await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 180000 });
await page.waitForTimeout(8000);

const finalUrl = page.url();
const text = await page.evaluate(() =>
  document.body.innerText.replace(/\s+/g, " ").slice(0, 160),
);

console.log(
  JSON.stringify(
    {
      signedIn,
      homeUrl: finalUrl,
      stillOnAuth: /\/auth\//.test(finalUrl),
      bodyStart: text,
    },
    null,
    2,
  ),
);

console.log("Browser left open. Close it when done.");
await context.waitForEvent("close").catch(() => {});
