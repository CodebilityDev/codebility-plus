// Counts real /api/profile-points requests on one /home/settings/profile load.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-count-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1300 },
});
const page = context.pages()[0] ?? (await context.newPage());

const calls = [];
page.on("request", (r) => {
  if (/\/api\/profile-points\//.test(r.url())) calls.push(r.url().split("/").pop());
});

// warm compile
await page.goto("http://localhost:3000/home/settings/profile", {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(12000);

calls.length = 0;
await page.goto("http://localhost:3000/home/settings/profile", {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(14000);

console.log(JSON.stringify({ label: process.argv[2] ?? "", requests: calls.length, ids: [...new Set(calls)] }, null, 2));
await context.close();
