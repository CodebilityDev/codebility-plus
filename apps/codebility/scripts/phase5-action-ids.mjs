// Identify which server actions fire on /home/feeds load, by reading the
// Next-Action header (the action id) on each POST.
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
  viewport: { width: 1600, height: 1000 },
});
const page = context.pages()[0] ?? (await context.newPage());

const actions = [];
page.on("request", (r) => {
  if (r.method() !== "POST") return;
  const h = r.headers();
  if (h["next-action"]) {
    actions.push({ id: h["next-action"], t: Date.now(), url: r.url() });
  }
});
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));

await page.goto("http://localhost:3000/home", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(4000);

const t0 = Date.now();
actions.length = 0;
await page.goto("http://localhost:3000/home/feeds", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(8000);

const grouped = {};
for (const a of actions) {
  const k = a.id.slice(0, 8);
  grouped[k] = grouped[k] || { id: a.id, count: 0, deltas: [] };
  grouped[k].count++;
  grouped[k].deltas.push(a.t - t0);
}

console.log(JSON.stringify({ totalPosts: actions.length, grouped, errors }, null, 2));
await context.close();
