// Opens a persistent Chrome window on the preview root and does nothing else.
// No scripted navigation after load: the user navigates and signs in manually,
// and the probe scripts later reuse this profile.
import path from "node:path";
import os from "node:os";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-aa06hbu6n-zeff01s-projects.vercel.app";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-preview-profile");

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1500, height: 1000 },
});

const page = context.pages()[0] ?? (await context.newPage());

page.on("close", () => console.log("window closed"));
context.on("close", () => console.log("context closed"));

await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 120000 }).catch((e) => {
  console.log("initial goto note:", String(e).slice(0, 200));
});

console.log(`PROFILE: ${PROFILE}`);
console.log(`Opened ${BASE}`);
console.log("Take over. Sign in and navigate wherever you need.");
console.log("This window stays open until YOU close it.");

// Hold the process open; never touch the page again.
await context.waitForEvent("close").catch(() => {});
console.log("done");
