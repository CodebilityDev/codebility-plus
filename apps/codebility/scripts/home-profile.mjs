// Breaks down where /home spends its time: server response, hydration, and
// whether content is interactive. Run against the dev server or a prod build.
import path from "node:path";
import os from "node:os";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-probe-profile");
const url = process.argv[2] ?? "http://localhost:3000/home";

const browser = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: null,
});
const page = browser.pages()[0] ?? (await browser.newPage());

const requests = [];
page.on("response", (r) => {
  const u = new URL(r.url());
  if (u.origin !== new URL(url).origin) return;
  requests.push({ path: u.pathname, status: r.status(), type: r.request().resourceType() });
});

const start = Date.now();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
const domReady = Date.now() - start;

await page.waitForLoadState("networkidle", { timeout: 60000 }).catch(() => {});
const networkIdle = Date.now() - start;

const metrics = await page.evaluate(() => {
  const nav = performance.getEntriesByType("navigation")[0] ?? {};
  const paint = performance.getEntriesByType("paint");
  const fcp = paint.find((p) => p.name === "first-contentful-paint");
  const resources = performance.getEntriesByType("resource");
  const slowest = resources
    .filter((r) => r.duration > 50)
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10)
    .map((r) => {
      const u = new URL(r.name);
      return { path: u.pathname, ms: Math.round(r.duration), type: r.initiatorType };
    });

  return {
    ttfb: Math.round(nav.responseStart ?? 0),
    domContentLoaded: Math.round(nav.domContentLoadedEventEnd ?? 0),
    loadEvent: Math.round(nav.loadEventEnd ?? 0),
    fcp: fcp ? Math.round(fcp.startTime) : null,
    totalResources: resources.length,
    transferKB: Math.round(
      resources.reduce((sum, r) => sum + (r.transferSize || 0), 0) / 1024,
    ),
    slowestResources: slowest,
    scriptCount: resources.filter((r) => r.initiatorType === "script").length,
    domNodes: document.getElementsByTagName("*").length,
  };
});

const counts = requests.reduce((acc, r) => {
  acc[r.type] = (acc[r.type] || 0) + 1;
  return acc;
}, {});

console.log(
  JSON.stringify(
    { url, domReadyMs: domReady, networkIdleMs: networkIdle, requestCounts: counts, ...metrics },
    null,
    2,
  ),
);

await browser.close();
