// Phase 5 services gate: catalog renders server-side, no mount-time fetch.
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
await page.goto("http://localhost:3000/home/settings/services", {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(8000);

const grouped = {};
for (const a of actions) grouped[a.id] = (grouped[a.id] ?? 0) + 1;

const ui = await page.evaluate(() => {
  const txt = document.body.innerText;
  return {
    hasHeading: /service/i.test(txt),
    serviceNames: ["Web Application Development", "Mobile Application Development", "Codev for Hire", "Product Design", "CMS Service", "AI Development"].filter((n) => txt.includes(n)),
    hasPreview: /preview/i.test(txt),
    hasDownload: /download|export/i.test(txt),
    bodyLen: txt.length,
  };
});

await page.screenshot({ path: path.join(os.tmpdir(), "codebility-phase2-shots", "services.png") });
console.log(JSON.stringify({ actionGroups: grouped, totalActions: actions.length, ui, errors }, null, 2));
await context.close();
