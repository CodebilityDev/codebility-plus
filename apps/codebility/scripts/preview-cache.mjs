// Isolates WHY a navigation re-fetches: watches the Router Cache by triggering
// one link, then immediately re-triggering it, and reports whether the second
// click hits the network. Also captures the prefetch set and any action POST
// that runs on plain navigation.
//
//   node scripts/preview-cache.mjs /home/in-house
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-22ly08bdz-zeff01s-projects.vercel.app";
const route = process.argv[2] ?? "/home/in-house";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-vercel-profile");
const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1500, height: 1000 },
});
const page = context.pages()[0] ?? (await context.newPage());

let reqs = [];
page.on("request", (r) => {
  if (!r.url().startsWith(BASE)) return;
  if (/_next\/static|\.(png|jpg|svg|webp|ico|woff2?)($|\?)/.test(r.url())) return;
  const isAction = r.method() === "POST" && r.headers()["next-action"];
  reqs.push(`${isAction ? "ACTION " : ""}${r.method()} ${r.url().replace(BASE, "").slice(0, 95)}`);
});

const settle = (ms) => page.waitForTimeout(ms);

await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 180000 });
await settle(12000);

// What did the initial page load prefetch?
const prefetchOnLoad = reqs.filter((r) => r.includes("_rsc="));
reqs = [];

// First visit to the target route.
const link = page.locator(`a[href="${route}"]`).first();
await link.click();
await settle(6000);
const firstVisit = reqs.splice(0);
const urlAfterFirst = page.url();

// Go somewhere else, then come back. This is the user's "navigate away and back".
const other = route === "/home/interns" ? "/home/clients" : "/home/interns";
const otherLink = page.locator(`a[href="${other}"]`).first();
if ((await otherLink.count()) > 0) {
  await otherLink.click();
  await settle(6000);
}
reqs = [];

// Return to the route that was just visited.
const backLink = page.locator(`a[href="${route}"]`).first();
await backLink.click();
await settle(6000);
const revisit = reqs.splice(0);

// And again immediately, to see whether the Router Cache now holds.
await page.locator(`a[href="${other}"]`).first().click().catch(() => {});
await settle(4000);
reqs = [];
await page.locator(`a[href="${route}"]`).first().click().catch(() => {});
await settle(4000);
const secondRevisit = reqs.splice(0);

console.log(
  JSON.stringify(
    {
      route,
      prefetchOnLoadCount: prefetchOnLoad.length,
      prefetchOnLoad,
      urlAfterFirstVisit: urlAfterFirst,
      firstVisit,
      firstVisitRequestCount: firstVisit.length,
      revisit,
      revisitRequestCount: revisit.length,
      secondRevisit,
      secondRevisitRequestCount: secondRevisit.length,
    },
    null,
    2,
  ),
);
await context.close();
