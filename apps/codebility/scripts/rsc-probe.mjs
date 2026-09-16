// Measures the RSC navigation request that Next issues on a client-side route
// change, and separates middleware cost from page-render cost.
//
// Usage: node scripts/rsc-probe.mjs [path...]
import path from "node:path";
import os from "node:os";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-probe-profile");
const routes = process.argv.slice(2);
const targets = routes.length ? routes : ["/home", "/home/projects", "/home/kanban"];

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: null,
});
const page = context.pages()[0] ?? (await context.newPage());

// Warm the session and compile every target once, so we measure steady state.
await page.goto("http://localhost:3000/home", {
  waitUntil: "domcontentloaded",
  timeout: 180000,
});
await page.waitForTimeout(4000);

const results = [];

for (const route of targets) {
  // Compile pass (discarded).
  await page.goto("http://localhost:3000" + route, {
    waitUntil: "domcontentloaded",
    timeout: 180000,
  });
  await page.waitForTimeout(2500);

  // Measure the RSC fetch the router makes for a client-side navigation.
  const timing = await page.evaluate(async (r) => {
    const url = r + (r.includes("?") ? "&" : "?") + "_rsc=probe" + Date.now();
    const t0 = performance.now();
    const res = await fetch(url, { headers: { RSC: "1" } });
    const ttfb = performance.now() - t0;
    const body = await res.text();
    const total = performance.now() - t0;
    return {
      status: res.status,
      ttfbMs: Math.round(ttfb),
      totalMs: Math.round(total),
      bytes: body.length,
    };
  }, route);

  results.push({ route, ...timing });
}

// Isolate middleware: a static asset skips it, a page route runs it.
const control = await page.evaluate(async () => {
  const t0 = performance.now();
  await fetch("/favicon.ico?cachebust=" + Date.now());
  return Math.round(performance.now() - t0);
});

console.log(JSON.stringify({ rscRequests: results, faviconControlMs: control }, null, 2));

await context.close();
