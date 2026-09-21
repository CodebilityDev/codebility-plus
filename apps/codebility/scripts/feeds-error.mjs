// Is the feeds "Error checking upvote status: Failed to fetch" a real bug or an
// artifact of navigating away mid-request? Load once, sit still, then compare
// against a load that is interrupted by navigation.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const BASE = "http://localhost:3000";
const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-fe-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1300 },
});
const page = context.pages()[0] ?? (await context.newPage());

let errs = [];
page.on("console", (m) => {
  if (m.type() === "error") errs.push(m.text().slice(0, 120));
});
page.on("pageerror", (e) => errs.push("pageerror: " + String(e).slice(0, 120)));

// warm
await page.goto(BASE + "/home/feeds", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(12000);

// A: undisturbed load
errs = [];
await page.goto(BASE + "/home/feeds", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(15000);
const undisturbed = errs.filter((e) => !/favicon|404/i.test(e));

// B: load then navigate away quickly (aborts in-flight server actions)
errs = [];
await page.goto(BASE + "/home/feeds", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(600);
await page.goto(BASE + "/home", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(6000);
const interrupted = errs.filter((e) => !/favicon|404/i.test(e));

console.log(
  JSON.stringify(
    {
      undisturbedLoad: { count: undisturbed.length, errors: undisturbed },
      interruptedLoad: { count: interrupted.length, errors: interrupted },
    },
    null,
    2,
  ),
);
await context.close();
