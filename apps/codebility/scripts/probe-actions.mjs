// Baseline/count probe for a route: server-action POSTs grouped by action id.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2];
if (!route) {
  console.error("usage: node probe-actions.mjs <route>");
  process.exit(1);
}

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

const actions = [];
page.on("request", (r) => {
  if (r.method() !== "POST") return;
  const h = r.headers();
  if (h["next-action"]) actions.push({ id: h["next-action"].slice(0, 8) });
});
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 250)));

await page.goto("http://localhost:3000/home", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(4000);

actions.length = 0;
await page.goto("http://localhost:3000" + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(10000);

const grouped = {};
for (const a of actions) grouped[a.id] = (grouped[a.id] ?? 0) + 1;

console.log(
  JSON.stringify(
    { route, totalActions: actions.length, actionGroups: grouped, errors },
    null,
    2,
  ),
);
await context.close();
