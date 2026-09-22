// Fast per-navigation measurement. One warm-up pass, then one measured pass.
// No artificial sleeps: waits on real signals only.
//
// Usage: node scripts/measure-nav.mjs /home/kanban /home/feeds ...
import os from "node:os";

const PORT = Number(process.env.CDP_PORT ?? 9222);
const BASE = process.env.NAV_BASE ?? "http://localhost:3000";
const ROUTES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["/home/kanban", "/home/feeds", "/home/interns", "/home/my-team"];

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const browser = await chromium.connectOverCDP(`http://127.0.0.1:${PORT}`);
const context = browser.contexts()[0];
const page = context.pages().find((p) => p.url().startsWith(BASE)) ?? context.pages()[0];

let bucket = [];
page.on("request", (r) => {
  const u = r.url();
  const kind = u.includes("/auth/v1/")
    ? "auth"
    : u.includes("/rest/v1/")
      ? "rest"
      : u.includes("_rsc=")
        ? "rsc"
        : null;
  if (kind) bucket.push(kind);
});
const drain = () => {
  const out = bucket;
  bucket = [];
  const c = (k) => out.filter((x) => x === k).length;
  return { auth: c("auth"), rest: c("rest"), rsc: c("rsc") };
};

const settle = () =>
  page
    .waitForFunction(() => !document.querySelector(".animate-pulse"), { timeout: 45000 })
    .catch(() => {});

// Warm-up: compile every route once so we measure navigation, not Turbopack.
for (const route of ROUTES) {
  await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 90000 }).catch(() => {});
  await settle();
}
drain();

const results = [];
for (const route of ROUTES) {
  // Enter from /home so the transition is client-side, as a user would.
  await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 90000 }).catch(() => {});
  await settle();
  drain();

  const t0 = Date.now();
  const link = page.locator(`a[href="${route}"]`).first();
  const via = (await link.count()) > 0 ? "click" : "goto";
  if (via === "click") await link.click({ timeout: 15000 }).catch(() => {});
  else await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded", timeout: 90000 }).catch(() => {});
  await settle();

  results.push({ route, via, ms: Date.now() - t0, ...drain() });
}

console.table(results.map((r) => ({ route: r.route, via: r.via, ms: r.ms, auth: r.auth, rest: r.rest, rsc: r.rsc })));
await browser.close();
