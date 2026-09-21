// Checks whether a route renders its expected content by searching visible text
// for known database values, independent of whether it uses <table> markup.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";
const route = process.argv[2];
const needles = process.argv.slice(3);
if (!route || needles.length === 0) {
  console.error("usage: node scripts/p11-content-check.mjs <route> <needle> [...]");
  process.exit(1);
}

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-content");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

const errs = [];
page.on("pageerror", (e) => errs.push(String(e)));

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 180000 });
await page.waitForTimeout(14000);

const text = await page.evaluate(() => document.body.innerText);
const lower = text.toLowerCase();

console.log(
  JSON.stringify(
    {
      route,
      pageErrors: errs,
      textLength: text.length,
      found: Object.fromEntries(
        needles.map((n) => [n, lower.includes(n.toLowerCase())]),
      ),
      excerpt: text.replace(/\s+/g, " ").slice(0, 700),
    },
    null,
    2,
  ),
);

await context.close();
