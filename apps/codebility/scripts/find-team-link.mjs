// Opens sidebar "My Team", reads the first project link href, so probes can hit
// a real /home/my-team/[projectId] route.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-phase2-profile");
const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

await page.goto("http://localhost:3000/home/my-team", {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(9000);

const links = await page.evaluate(() =>
  [...document.querySelectorAll("a[href]")]
    .map((a) => a.getAttribute("href"))
    .filter((h) => h && /^\/home\/my-team\/[^/]+$/.test(h)),
);

console.log(JSON.stringify({ links: [...new Set(links)] }, null, 2));
await context.close();
