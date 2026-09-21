// Measure whether WeeklyTop blocks DashboardContent: record when each dashboard
// section first appears after /home navigation.
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

await page.goto("http://localhost:3000/home", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(4000);

// Hard reload so we time the server render, then sample section arrival.
await page.reload({ waitUntil: "commit" });
const marks = await page.evaluate(async () => {
  const t0 = performance.now();
  const want = {
    profile: () => /Points Overview/i.test(document.body.innerText),
    currentProject: () => /Current Project|No current project/i.test(document.body.innerText),
    leaderboard: () => /Leaderboard/i.test(document.body.innerText),
    roadmap: () => /Career Progression Roadmap/i.test(document.body.innerText),
  };
  const seen = {};
  return await new Promise((resolve) => {
    const iv = setInterval(() => {
      const t = Math.round(performance.now() - t0);
      for (const [k, fn] of Object.entries(want)) {
        if (seen[k] === undefined && fn()) seen[k] = t;
      }
      if (t > 9000) {
        clearInterval(iv);
        resolve(seen);
      }
    }, 16);
  });
});

console.log(JSON.stringify({ sectionArrivalMs: marks }, null, 2));
await context.close();
