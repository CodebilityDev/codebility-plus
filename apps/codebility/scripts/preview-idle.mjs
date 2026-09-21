// Separates the two suspects for the duplicate page-1 fetch:
//   (a) usePaginatedQuery running queryFn on mount (initialDataUpdatedAt: 0)
//   (b) the sidebar prefetch re-rendering the route
// It hard-loads a route with prefetch observed, and reports whether the
// duplicate action still fires when the page is left completely untouched.
//
//   node scripts/preview-idle.mjs /home/clients
import path from "node:path";
import os from "node:os";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-22ly08bdz-zeff01s-projects.vercel.app";
const route = process.argv[2] ?? "/home/clients";

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

const timeline = [];
page.on("request", (r) => {
  if (!r.url().startsWith(BASE)) return;
  if (/_next\/static|\.(png|jpg|svg|webp|ico|woff2?)($|\?)/.test(r.url())) return;
  const isAction = r.method() === "POST" && r.headers()["next-action"];
  timeline.push({
    t: Date.now(),
    label: isAction ? "ACTION" : r.method(),
    url: r.url().replace(BASE, "").slice(0, 80),
    body: isAction ? (r.postData() ?? "").slice(0, 80) : undefined,
  });
});

await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 180000 });
await page.waitForTimeout(9000);

timeline.length = 0;
const t0 = Date.now();

// Hard load the target and then do NOTHING for 20 s.
await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 180000 });
await page.waitForTimeout(20000);

const rows = await page.evaluate(() => document.querySelectorAll("tbody tr").length);

console.log(
  JSON.stringify(
    {
      route,
      idleWindowMs: 20000,
      rowsRendered: rows,
      timeline: timeline.map((e) => ({ ...e, at: `${((e.t - t0) / 1000).toFixed(1)}s` })),
    },
    null,
    2,
  ),
);
await context.close();
