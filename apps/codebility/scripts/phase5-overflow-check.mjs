// Phase 5 overflow gate: first page renders from server props, trending topics
// and social points present, no mount-time action POSTs.
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
await page.goto("http://localhost:3000/home/overflow", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(8000);

const grouped = {};
for (const a of actions) grouped[a.id] = (grouped[a.id] ?? 0) + 1;

const ui = await page.evaluate(() => {
  const txt = document.body.innerText;
  return {
    heading: [...document.querySelectorAll("h1")].map((h) => h.textContent)[0] ?? null,
    hasSocialPoints: /Social Points/i.test(txt),
    socialPointsValue: txt.match(/Social Points[:\s]*([\d,]+)/i)?.[1] ?? null,
    hasTrending: /trending/i.test(txt),
    hasPagination: /\d+\s*(of|\/)\s*\d+/i.test(txt) || !!document.querySelector("[aria-label*='page' i]"),
    bodyLen: txt.length,
    skeletonCount: document.querySelectorAll(".animate-pulse").length,
  };
});

await page.screenshot({ path: path.join(os.tmpdir(), "codebility-phase2-shots", "overflow.png") });
console.log(JSON.stringify({ actionGroups: grouped, totalActions: actions.length, ui, errors }, null, 2));
await context.close();
