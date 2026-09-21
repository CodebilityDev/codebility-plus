// Verify admin-dashboard charts still render after the dynamic-import split.
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
  viewport: { width: 1600, height: 1400 },
});
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 250)));

await page.goto("http://localhost:3000/home/admin-dashboard", {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(12000);

const info = await page.evaluate(() => ({
  heading: document.querySelector("h1")?.textContent ?? null,
  // recharts renders <svg class="recharts-surface">
  svgCharts: document.querySelectorAll("svg.recharts-surface").length,
  anySvg: document.querySelectorAll("svg").length,
  pieSectors: document.querySelectorAll(".recharts-pie-sector").length,
  lines: document.querySelectorAll(".recharts-line").length,
  stillLoading: document.querySelectorAll(".animate-pulse").length,
  bodyLen: document.body.innerText.length,
}));

await page.screenshot({ path: path.join(os.tmpdir(), "codebility-phase2-shots", "admin-dash.png") });
console.log(JSON.stringify({ info, errors }, null, 2));
await context.close();
