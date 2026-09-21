// Measure the points-fetch burst: how many /api/codev/*/points requests fire and
// how long the whole burst takes (wall clock), for the my-team detail route.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2];
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
  viewport: { width: 1600, height: 1400 },
});
const page = context.pages()[0] ?? (await context.newPage());

let firstAt = null;
let lastAt = null;
let count = 0;
const times = [];
page.on("requestfinished", (r) => {
  if (!/\/api\/codev\/[^/]+\/points$/.test(r.url())) return;
  const t = Date.now();
  if (firstAt === null) firstAt = t;
  lastAt = t;
  count++;
  times.push(t);
});
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));

await page.goto("http://localhost:3000" + route, {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(14000);

// Group into rounds: a new round starts after a >250ms gap.
const rounds = [];
let prev = null;
for (const t of times) {
  if (prev === null || t - prev > 250) rounds.push(1);
  else rounds[rounds.length - 1]++;
  prev = t;
}

console.log(
  JSON.stringify(
    {
      pointsRequests: count,
      burstMs: firstAt && lastAt ? lastAt - firstAt : null,
      rounds,
      errors,
    },
    null,
    2,
  ),
);
await context.close();
