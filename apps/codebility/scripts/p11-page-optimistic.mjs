// Proves the optimistic page update in a way that survives the skeleton swap.
//
// The plan's A-1 samples the pager mid-flight, but a correct skeleton REPLACES
// the pager, so no marker exists then. The observable claim is instead: when the
// skeleton clears, the marker is already on the requested page rather than the
// old one. With a server-driven marker it would briefly read the old page.
//
// It also asserts A-2 with a shape-based count rather than a size threshold:
// the skeleton's per-column bars are legitimately 128x16, so the >=120x24 filter
// only matched decorative nodes.
//
//   node scripts/p11-page-optimistic.mjs /home/in-house
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
const PROFILE = path.join(os.tmpdir(), "codebility-p11-optimistic");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

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

const num = (v) => (v === null ? null : Number(v));

// Page marker, scoped away from the sidebar nav link with the same aria-current.
const activePage = () =>
  page.evaluate(() => {
    const marked = [...document.querySelectorAll('[aria-current="page"],[aria-current="true"]')]
      .filter((e) => e.getBoundingClientRect().left > 240)
      .map((e) => (e.textContent || "").trim())
      .find((t) => /^\d+$/.test(t));
    return marked ?? null;
  });

// A skeleton is present when placeholder bars inside a table/grid are rendered.
// Counted by node count, not by a minimum box, because these bars are small.
const skeletonCount = () =>
  page.evaluate(
    () =>
      [...document.querySelectorAll(".animate-pulse")].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }).length,
  );

const before = num(await activePage());
const skeletonBefore = await skeletonCount();

// Advance one page with the response held.
delayArmed = true;
const target = String((before ?? 1) + 1);
await page
  .locator("nav")
  .filter({ hasText: /Previous/ })
  .last()
  .locator("a", { hasText: new RegExp(`^${target}$`) })
  .first()
  .click({ timeout: 15000 })
  .catch(() => {});

// Sample mid-flight: the request is held for DELAY_MS.
await page.waitForTimeout(400);
const inflight = {
  skeletonNodes: await skeletonCount(),
  activePage: await activePage(),
  requestFired: requestCount > 0,
};

// Wait for the skeleton to clear, then read the marker IMMEDIATELY. If the
// marker were server-driven it would read the old page at this instant.
let firstAfterClear = null;
for (let i = 0; i < 60; i++) {
  await page.waitForTimeout(150);
  const s = await skeletonCount();
  if (s === 0) {
    firstAfterClear = await activePage();
    break;
  }
}

await page.waitForTimeout(2500);
const settled = { activePage: await activePage(), skeletonNodes: await skeletonCount() };

const checks = {
  "C-1 page marker is on the requested page the moment the skeleton clears":
    num(firstAfterClear) === (before ?? 1) + 1,
  "C-2 skeleton appears during the change": inflight.skeletonNodes > skeletonBefore,
  "C-2b skeleton clears once settled": settled.skeletonNodes <= skeletonBefore,
  "no page errors": errors.length === 0,
};

console.log(
  JSON.stringify(
    {
      route,
      skeletonBefore,
      before: { activePage: before },
      inflight,
      firstMarkerAfterSkeletonClears: firstAfterClear,
      settled,
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
