// Phase 4 gate: verify the shell streams before the sidebar resolves, and that
// the navbar does not flash empty (the failure mode that reverted seeding before).
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
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));

await page.goto("http://localhost:3000/home", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(4000);

// Hard navigation with sampling: does the navbar avatar appear before sidebar links?
const sample = await page.evaluate(async () => {
  const t0 = performance.now();
  const samples = [];
  const nav = performance.now();
  const seen = { shell: null, navbar: null, sidebar: null };

  return await new Promise((resolve) => {
    const iv = setInterval(() => {
      const t = Math.round(performance.now() - t0);
      if (seen.shell === null && document.querySelector("nav[role='banner']"))
        seen.shell = t;
      if (seen.navbar === null && document.querySelector("nav[role='banner'] img"))
        seen.navbar = t;
      if (seen.sidebar === null && document.querySelector("aside[aria-label='Main navigation sidebar'] a"))
        seen.sidebar = t;
      samples.push({ t, ...seen });
      if (t > 6000) {
        clearInterval(iv);
        resolve({ seen, last: samples[samples.length - 1] });
      }
    }, 16);
  });
});

// Reload and measure the same from a cold paint.
await page.reload({ waitUntil: "commit" });
const after = await page.evaluate(async () => {
  const t0 = performance.now();
  const seen = { shell: null, navbar: null, sidebar: null };
  return await new Promise((resolve) => {
    const iv = setInterval(() => {
      const t = Math.round(performance.now() - t0);
      if (seen.shell === null && document.querySelector("nav[role='banner']")) seen.shell = t;
      if (seen.navbar === null && document.querySelector("nav[role='banner'] img")) seen.navbar = t;
      if (seen.sidebar === null && document.querySelector("aside[aria-label='Main navigation sidebar'] a")) seen.sidebar = t;
      if (t > 6000) { clearInterval(iv); resolve(seen); }
    }, 16);
  });
});

console.log(JSON.stringify({ firstLoad: sample.seen, reload: after, errors }, null, 2));
await context.close();
