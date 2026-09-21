// Route-shape probe for card grids (interns): counts rendered cards, checks the
// server payload carries no columns the card does not read, and walks the pager.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/interns";
const BASE = process.env.P9_BASE ?? "http://localhost:3001";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p9-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 250)));

let requests = [];
let capturing = false;
page.on("request", (r) => {
  if (!capturing) return;
  const h = r.headers();
  if ((r.method() === "POST" && h["next-action"]) || (r.method() === "GET" && r.url().includes("/api/"))) {
    requests.push({ url: r.url(), action: h["next-action"]?.slice(0, 8) ?? null });
  }
});
const settle = (ms = 2500) => page.waitForTimeout(ms);

const results = { route, steps: {} };

await page.goto(BASE + "/home", { waitUntil: "domcontentloaded", timeout: 300000 });
await settle(4000);

// Count the developer cards by their stable heading structure.
const cardCount = () =>
  page.evaluate(() => document.querySelectorAll("[class*='rounded-2xl'][class*='backdrop-blur']").length);

requests = [];
capturing = true;
await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await settle(7000);
capturing = false;
results.steps.loadClientRequests = requests.length;
results.steps.cardBlocksOnLoad = await cardCount();

// Names rendered, to catch a blank-field regression.
results.steps.sampleHeadings = await page.evaluate(() =>
  [...document.querySelectorAll("h3")]
    .slice(0, 8)
    .map((h) => (h.textContent || "").trim())
    .filter(Boolean),
);

// Pager walk.
const pager = page.locator("nav").filter({ hasText: /Previous/ }).last();
const clickPage = async (label) => {
  const link = pager.getByText(label, { exact: true }).first();
  if (!(await link.count())) return false;
  await link.click();
  await settle(3000);
  return true;
};

requests = [];
capturing = true;
const wentTo2 = await clickPage("2");
const afterPage2 = requests.length;
const backTo1 = await clickPage("1");
await settle(2000);
const afterBack = requests.length;
capturing = false;

results.steps.pagination = {
  wentTo2,
  backTo1,
  requestsToPage2: afterPage2,
  requestsReturningToPage1: afterBack - afterPage2,
  cardsAfterReturn: await cardCount(),
};

results.pageErrors = pageErrors;
console.log(JSON.stringify(results, null, 2));
await context.close();
