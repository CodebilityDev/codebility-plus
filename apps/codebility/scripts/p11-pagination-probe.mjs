// Asserts the pagination feedback contract (Phase 11 workstream A).
//
// Technique: the list server action is delayed by ~2.5s via page.route, so the
// UI can be observed WHILE the request is in flight. Without the delay the
// response lands too fast to tell an optimistic update from a server-driven one.
//
// Usage: P10_BASE=http://localhost:3000 node scripts/p11-pagination-probe.mjs /home/in-house
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/in-house";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";
const DELAY_MS = 2500;

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));

let requestCount = 0;
let delayArmed = false;
await page.route("**/*", async (r) => {
  const req = r.request();
  if (req.method() === "POST" && req.headers()["next-action"]) {
    requestCount++;
    if (delayArmed) await new Promise((res) => setTimeout(res, DELAY_MS));
  }
  await r.continue();
});

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(13000);

// Real loading skeletons only: decorative .animate-pulse nodes are small.
const skeletonBlocks = () =>
  page.evaluate(
    () =>
      [...document.querySelectorAll(".animate-pulse")].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.height >= 24 && r.width >= 120;
      }).length,
  );

// The active page marker. NOTE: aria-current="page" also matches the sidebar
// nav link, so restrict to the main column (the fixed sidebar sits at left < 240)
// and to purely numeric text.
const activePage = () =>
  page.evaluate(() => {
    const marked = [...document.querySelectorAll('[aria-current="page"],[aria-current="true"]')]
      .filter((e) => e.getBoundingClientRect().left > 240)
      .map((e) => (e.textContent || "").trim())
      .find((t) => /^\d+$/.test(t));
    return marked ?? null;
  });

const firstRow = () =>
  page.evaluate(
    () => document.querySelector("tbody tr")?.innerText.replace(/\s+/g, " ").slice(0, 34) ?? null,
  );

const settledSkeleton = await skeletonBlocks();
const pageBefore = await activePage();
const rowBefore = await firstRow();

// Click "next" with the response delayed, then sample DURING the flight.
delayArmed = true;
// This pagination renders numeric buttons only; there is no labelled "Next".
// Target the button whose text is the page after the current one.
const target = String(Number(pageBefore ?? "1") + 1);
const next = page
  .locator("button,a")
  .filter({ hasText: new RegExp(`^${target}$`) })
  .filter({ hasNot: page.locator("[disabled]") })
  .last();

const hasNext = (await next.count()) > 0;
let inflight = null;

if (hasNext) {
  const before = requestCount;
  await next.click({ timeout: 15000 }).catch(() => {});
  // Sample early: the response is held for DELAY_MS.
  await page.waitForTimeout(350);
  inflight = {
    activePage: await activePage(),
    skeletonBlocks: await skeletonBlocks(),
    firstRow: await firstRow(),
    requestFired: requestCount > before,
  };
  await page.waitForTimeout(DELAY_MS + 2500);
}

const settled = {
  activePage: await activePage(),
  skeletonBlocks: await skeletonBlocks(),
  firstRow: await firstRow(),
};

// A6: returning to a visited page must cost nothing.
delayArmed = false;
const back = String(pageBefore ?? "1");
const prev = page
  .locator("button,a")
  .filter({ hasText: new RegExp(`^${back}$`) })
  .last();
const beforeBack = requestCount;
if (await prev.count()) {
  await prev.click({ timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
}
const requestsGoingBack = requestCount - beforeBack;

const checks = {
  "A-1 page number updates before the response": hasNext
    ? inflight?.activePage !== null && inflight?.activePage !== pageBefore
    : null,
  "A-2 skeleton visible during the change": hasNext
    ? (inflight?.skeletonBlocks ?? 0) > settledSkeleton
    : null,
  "A-2b skeleton cleared once settled": settled.skeletonBlocks <= settledSkeleton,
  "A-6 returning to a cached page issues 0 requests": requestsGoingBack === 0,
  "no page errors": errors.length === 0,
};

console.log(
  JSON.stringify(
    {
      route,
      settledSkeletonBaseline: settledSkeleton,
      before: { activePage: pageBefore, firstRow: rowBefore },
      inflight,
      settled,
      requestsGoingBack,
      checks,
      verdict: Object.entries(checks)
        .filter(([, v]) => v === false)
        .map(([k]) => `FAIL ${k}`),
      pageErrors: errors,
    },
    null,
    2,
  ),
);
await context.close();
