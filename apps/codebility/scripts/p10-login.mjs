// Opens the shared probe profile on the sign-in page and waits for the session
// to become valid, so the probe suite can authenticate afterwards.
// Leaves the browser open until the user closes it.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";
const TIMEOUT_MS = Number(process.env.LOGIN_TIMEOUT_MS ?? 600000);

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

// Deliberately the SHARED profile, not a copy: whatever the user signs in as is
// what every later probe inherits.
const PROFILE = path.join(os.tmpdir(), "codebility-probe-profile");
if (!fs.existsSync(PROFILE)) {
  console.error(`Shared profile missing: ${PROFILE}`);
  process.exit(1);
}

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1400, height: 1000 },
});
const page = context.pages()[0] ?? (await context.newPage());

await page.goto(`${BASE}/auth/sign-in`, {
  waitUntil: "domcontentloaded",
  timeout: 120000,
});
console.log(`Opened ${page.url()}`);
console.log("Sign in in the opened window. Waiting for the dashboard...");

const deadline = Date.now() + TIMEOUT_MS;
let signedIn = false;

while (Date.now() < deadline) {
  await page.waitForTimeout(3000);

  // The app redirects /home to /auth/sign-in when there is no session, so a
  // successful sign-in shows up as the URL leaving /auth and /home rendering
  // the signed-in shell (the user menu is only present with a session).
  try {
    const url = page.url();
    const onAuth = /\/auth\//.test(url);
    const hasUserMenu = await page
      .locator('button[aria-label*="user menu" i], [aria-label*="Open user menu" i]')
      .count();

    if (!onAuth && hasUserMenu > 0) {
      console.log(`SIGNED IN. URL: ${url}`);
      console.log(`User menu present: ${hasUserMenu}`);
      signedIn = true;
      break;
    }
  } catch {
    // Navigation in flight; try again on the next tick.
  }
}

if (!signedIn) {
  console.log("TIMEOUT: still not signed in after the wait window.");
}

// Verify /home actually renders authenticated before handing back.
await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(6000);
const finalUrl = page.url();
const text = await page.evaluate(() =>
  document.body.innerText.replace(/\s+/g, " ").slice(0, 120),
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

console.log("Browser left open. Close it when the probes are done.");
await context.waitForEvent("close").catch(() => {});
