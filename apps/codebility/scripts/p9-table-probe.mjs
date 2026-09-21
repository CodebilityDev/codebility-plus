// Phase 9 table contract probe. Asserts the Rule 0/2/3 behaviour for a route:
// page 1 is server-rendered (no client data request), the payload carries only
// rendered columns, revisiting a page costs nothing, and opening a row fetches
// detail once. Usage:
//   node scripts/p9-table-probe.mjs /home/in-house
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/in-house";
const BASE = process.env.P9_BASE ?? "http://localhost:3001";
const PAGE_SIZE = Number(process.argv[3] ?? 50);

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

// Only Next.js server-action POSTs and /api/* GETs count as "client data
// requests". Layout-level traffic is measured separately against /home.
let requests = [];
let capturing = false;
page.on("request", (r) => {
  if (!capturing) return;
  const h = r.headers();
  const isAction = r.method() === "POST" && h["next-action"];
  const isApi = r.method() === "GET" && r.url().includes("/api/");
  if (isAction || isApi) requests.push({ url: r.url(), action: h["next-action"]?.slice(0, 8) ?? null });
});

const settle = async (ms = 2500) => page.waitForTimeout(ms);

const results = { route, steps: {} };

// Warm the route first: a cold Turbopack compile is not a measurement.
await page.goto(BASE + "/home", { waitUntil: "domcontentloaded", timeout: 300000 });
await settle(4000);

// --- Baseline: the /home shell itself issues layout-level requests. The table's
// own data must show up as a delta above this, so measure it first.
requests = [];
capturing = true;
await page.goto(BASE + "/home", { waitUntil: "domcontentloaded", timeout: 300000 });
await settle(5000);
capturing = false;
results.steps.baselineHomeClientRequests = requests.length;
results.steps.baselineHomeRequestDetail = requests;

// --- Step 0: Rule 0 gate. Fresh load must issue zero ADDITIONAL client data
// requests beyond the shell baseline.
requests = [];
capturing = true;
await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await settle(6000);
capturing = false;
results.steps.loadClientRequests = requests.length;
results.steps.loadRequestDetail = requests;
results.steps.rule0DeltaOverHome =
  requests.length - results.steps.baselineHomeClientRequests;

// --- Step 1/2: rows rendered + payload shape.
const rowCount = await page.locator("table tbody tr").count();
results.steps.rowsRendered = rowCount;

// Capture the RSC payload for this route and check for unrendered relations.
const html = await page.content();
results.steps.payloadHasHeavyFields = ["work_experience", "education", "about"].filter(
  (f) => html.includes(f),
);

// --- Step 3: page 1 -> 2 -> 3 -> 1, the return must cost zero.
// The pager renders PaginationLink as <a> inside a <nav>; scope to that nav so
// the sidebar's own "1"-less links can never be matched by accident.
const pager = page.locator("nav").filter({ hasText: /Previous/ }).last();
const clickPage = async (label) => {
  const link = pager.getByText(label, { exact: true }).first();
  if (!(await link.count())) return false;
  await link.click();
  await settle(2500);
  return true;
};

requests = [];
capturing = true;
const wentTo2 = await clickPage("2");
const afterPage2 = requests.length;
const wentTo3 = await clickPage("3");
const afterPage3 = requests.length;
const backTo1 = await clickPage("1");
await settle(2000);
const afterBack = requests.length;
capturing = false;

results.steps.pagination = {
  wentTo2,
  wentTo3,
  backTo1,
  requestsToPage2: afterPage2,
  requestsToPage3Requested: afterPage3 - afterPage2,
  requestsReturningToPage1: afterBack - afterPage3,
  rowsAfterReturn: await page.locator("table tbody tr").count(),
};

// --- Step 5: open a row -> detail request; reopen -> zero.
requests = [];
capturing = true;
const firstRow = page.locator("table tbody tr").first();
if (await firstRow.count()) {
  await firstRow.click();
  await settle(2500);
}
results.steps.detailOnFirstOpen = requests.length;
const closeBtn = page.locator('button[title="Close Preview"]').first();
if (await closeBtn.count()) {
  await closeBtn.click();
  await settle(1200);
}
requests = [];
capturing = true;
if (await firstRow.count()) {
  await firstRow.click();
  await settle(2500);
}
results.steps.detailOnReopen = requests.length;
capturing = false;

results.pageErrors = pageErrors;

console.log(JSON.stringify(results, null, 2));
await context.close();
