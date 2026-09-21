import { chromium } from "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BASE = process.argv[2] || "http://localhost:3000";
const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p8nav-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const ctx = await chromium.launchPersistentContext(PROFILE, {
  channel: "chrome",
  headless: false,
  chromiumSandbox: true,
  viewport: { width: 1440, height: 900 },
  args: ["--no-first-run", "--no-default-browser-check"],
});
// Restored session tabs can be stuck; start from one clean page.
for (const p of ctx.pages().slice(0, -1)) await p.close().catch(() => {});
const page = ctx.pages()[0] ?? (await ctx.newPage());
await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 60000 });
console.log("session ok:", await page.title());

const rscHits = [];
page.on("request", (r) => {
  if (r.headers()["rsc"] === "1") rscHits.push(new URL(r.url()).pathname);
});

const skeletons = async () => {
  // Counting .animate-pulse is misleading: presence dots and decorative divs
  // carry it permanently. A loading skeleton is made of placeholder blocks, so
  // only count pulse nodes with real block dimensions.
  let seen = 0;
  for (let i = 0; i < 24; i++) {
    const n = await page.evaluate(() =>
      [...document.querySelectorAll(".animate-pulse")].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.height >= 24 && r.width >= 120;
      }).length,
    );
    if (n > seen) seen = n;
    await page.waitForTimeout(25);
  }
  return seen;
};

const visit = async (label, href) => {
  rscHits.length = 0;
  const t = Date.now();
  await page.goto(`${BASE}${href}`, { waitUntil: "domcontentloaded" });
  const pulse = await skeletons();
  const ms = Date.now() - t;
  console.log(
    `${label.padEnd(34)} ${String(ms).padStart(6)}ms  pulse=${String(pulse).padStart(3)}  rsc=${rscHits.length} ${rscHits.join(",")}`,
  );
  return { ms, pulse, rsc: rscHits.length };
};

const warm = async (h) => {
  await page.goto(`${BASE}${h}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
};

console.log("warming...");
for (const h of ["/home", "/home/feeds", "/home/overflow"]) await warm(h);

console.log("\n-- cold visits (full load, skeleton expected)");
for (const h of ["/home", "/home/feeds", "/home/overflow"]) await visit("cold " + h, h);

console.log("\n-- revisit within 30s: nav away, then back to the same route");
const go = async (name, href) => {
  rscHits.length = 0;
  const t = Date.now();
  await page.locator(`a[href="${href}"]`).first().click({ timeout: 5000 });
  await page.waitForTimeout(150);
  const pulse = await skeletons();
  console.log(
    `nav  -> ${name.padEnd(28)} ${String(Date.now() - t).padStart(6)}ms  pulse=${String(pulse).padStart(3)}  rsc=${rscHits.length} ${rscHits.join(",")}`,
  );
  return { pulse, rsc: rscHits.length };
};

await warm("/home");
const results = [];
const lastVisit = new Map();
for (const [name, href] of [
  ["/home/feeds", "/home/feeds"],
  ["/home", "/home"],
  ["/home/feeds", "/home/feeds"],
  ["/home", "/home"],
  ["/home/overflow", "/home/overflow"],
  ["/home", "/home"],
  ["/home/overflow", "/home/overflow"],
]) {
  const r = await go(name, href);
  const now = Date.now();
  r.gap = lastVisit.has(name) ? now - lastVisit.get(name) : null;
  lastVisit.set(name, now);
  results.push([name, r]);
}

console.log("\n-- REVISITS within the staleTimes window (must be rsc=0, no skeleton)");
const seen = new Set();
for (const [name, r] of results) {
  if (!seen.has(name)) {
    seen.add(name);
    continue;
  }
  const inWindow = r.gap !== null && r.gap < 3600000;
  if (!inWindow) {
    console.log(`skip  revisit ${name.padEnd(20)} gap=${r.gap}ms outside window`);
    continue;
  }
  const ok = r.rsc === 0 ? "PASS" : "FAIL";
  console.log(
    `${ok}  revisit ${name.padEnd(20)} gap=${String(r.gap).padStart(5)}ms rsc=${r.rsc} skeleton=${r.pulse}`,
  );
}

// Reported regression: my-team re-fetched when arriving from overflow, because
// the route declared `revalidate = 300` against a 30s router window and awaited
// getUserProjects() above its Suspense boundary.
console.log("\n-- reported loop: my-team <-> overflow");
await warm("/home/my-team");
await warm("/home/overflow");
await warm("/home/my-team");
for (const [name, href] of [
  ["/home/overflow", "/home/overflow"],
  ["/home/my-team", "/home/my-team"],
  ["/home/overflow", "/home/overflow"],
  ["/home/my-team", "/home/my-team"],
]) {
  const r = await go(name, href);
  const verdict = r.rsc === 0 && r.pulse === 0 ? "PASS" : "FAIL";
  console.log(`  ${verdict}  ${name.padEnd(18)} rsc=${r.rsc} skeleton=${r.pulse}`);
}

// A route skeleton is transient. Settled skeleton counts are the baseline each
// route keeps at rest, so compare against that rather than against zero.
console.log("\n-- settled skeleton baseline per route");
for (const h of ["/home", "/home/feeds", "/home/overflow", "/home/my-team"]) {
  await warm(h);
  await page.waitForTimeout(5000);
  console.log(`settled ${h.padEnd(18)} skeleton=${await skeletons()}`);
}

await ctx.close();
