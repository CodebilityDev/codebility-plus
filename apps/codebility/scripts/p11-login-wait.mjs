// Opens the sign-in page in a visible browser and waits for the user to complete
// login, then reports the resulting URL. Polls until signed in or timeout.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";
const WAIT_MS = Number(process.env.WAIT_MS ?? 600000);
const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-login");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1280, height: 900 },
});
const page = context.pages()[0] ?? (await context.newPage());

await page.goto(BASE + "/auth/sign-in", {
  waitUntil: "domcontentloaded",
  timeout: 120000,
});

const deadline = Date.now() + WAIT_MS;
let signedIn = false;
while (Date.now() < deadline) {
  await page.waitForTimeout(4000);
  if (!page.url().includes("sign-in")) {
    signedIn = true;
    break;
  }
}

console.log(
  JSON.stringify({ signedIn, url: page.url(), profile: PROFILE }, null, 2),
);

// Persist the (now authenticated) profile back to the shared location so later
// probes inherit the session.
if (signedIn) {
  await page.waitForTimeout(3000);
  await context.close();
  fs.rmSync(SHARED, { recursive: true, force: true });
  fs.cpSync(PROFILE, SHARED, { recursive: true });
  console.log("session persisted to shared profile");
} else {
  await context.close();
}
