// Workstream A: reports whether /home/time-tracker renders real content or its
// error boundary, and captures any console/server errors. The plan is explicit
// that "the boundary is gone" is not sufficient evidence on its own.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";
const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-tracker");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

const consoleErrs = [];
const pageErrs = [];
const failed = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrs.push(m.text().slice(0, 300));
});
page.on("pageerror", (e) => pageErrs.push(String(e).slice(0, 300)));
page.on("response", (r) => {
  if (r.status() >= 400) failed.push(`${r.status()} ${r.url().slice(0, 160)}`);
});

const t0 = Date.now();
await page.goto(BASE + "/home/time-tracker", {
  waitUntil: "domcontentloaded",
  timeout: 180000,
});
let firstContentMs = null;
try {
  await page.waitForFunction(
    () => document.body.innerText.trim().length > 200,
    { timeout: 120000 },
  );
  firstContentMs = Date.now() - t0;
} catch {
  firstContentMs = null;
}
await page.waitForTimeout(8000);

const text = await page.evaluate(() => document.body.innerText);
const lower = text.toLowerCase();

console.log(
  JSON.stringify(
    {
      url: page.url(),
      firstContentMs,
      errorBoundaryVisible:
        lower.includes("unable to load time logs") ||
        lower.includes("couldn't retrieve your time tracking data"),
      hasTimeLogsHeading: lower.includes("time logs"),
      hasRenderedHours: lower.includes("rendered hours"),
      hasExcessHours: lower.includes("excess hours"),
      hasSchedule: lower.includes("my time schedule"),
      serverErrorMessage: lower.includes("server components render"),
      consoleErrors: consoleErrs,
      pageErrors: pageErrs,
      failedRequests: failed,
      excerpt: text.replace(/\s+/g, " ").slice(0, 500),
    },
    null,
    2,
  ),
);

await context.close();
