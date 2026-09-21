// Measures client-side navigation on the production preview:
//   - which sidebar link is clicked
//   - how long until the page actually shows content
//   - whether a skeleton appeared (loading.tsx fired)
//   - every network request the navigation made (RSC payloads, actions, api)
//   - whether revisiting an already-visited page refetched
//   - any "something went wrong" / server error text
//
// Read-only: it never edits the app, it only drives the browser.
//
//   node scripts/preview-nav.mjs /home/in-house /home/interns ...
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-22ly08bdz-zeff01s-projects.vercel.app";

const routes = process.argv.slice(2);
if (routes.length === 0) {
  console.error("usage: node scripts/preview-nav.mjs <route> [route...]");
  process.exit(1);
}

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

const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 220)));

// Fail loudly instead of throwing "target closed" mid-run: we want the partial
// results, since a crashed navigation is itself a finding.
let closed = false;
context.on("close", () => {
  closed = true;
});
const guard = (label) => {
  if (closed) {
    console.log(
      JSON.stringify(
        { error: `browser closed during: ${label}`, results, pageErrors },
        null,
        2,
      ),
    );
    process.exit(2);
  }
};

// Everything cross-origin except the document itself and static assets.
let requests = [];
page.on("request", (r) => {
  const url = r.url();
  if (!url.startsWith(BASE)) {
    if (/supabase|vercel\.app\/api/.test(url)) {
      requests.push({ kind: "external", method: r.method(), url: url.slice(0, 110) });
    }
    return;
  }
  if (/_next\/static|\.(png|jpg|svg|webp|ico|woff2?)($|\?)/.test(url)) return;
  const headers = r.headers();
  const isAction = r.method() === "POST" && headers["next-action"];
  requests.push({
    kind: isAction ? "action" : "rsc-or-api",
    method: r.method(),
    url: url.replace(BASE, "").slice(0, 110),
  });
});

const settle = (ms) => page.waitForTimeout(ms);

// Does the viewport currently contain real content (vs a skeleton)?
const surfaceState = () =>
  page.evaluate(() => {
    const text = document.body.innerText.replace(/\s+/g, " ").trim();
    // Skeleton swatches: animate-pulse blocks of a meaningful size.
    const skeletons = [...document.querySelectorAll(".animate-pulse")].filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width >= 120 && r.height >= 24;
    }).length;
    const rows = document.querySelectorAll("tbody tr").length;
    const cards = document.querySelectorAll("article").length;
    const err = /something went wrong|application error|an error occurred|internal server error|failed to load/i.test(
      text,
    );
    return { len: text.length, skeletons, rows, cards, err, head: text.slice(0, 90) };
  });

const results = [];

await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 180000 });
await settle(10000);
results.push({
  step: "warm /home",
  url: page.url(),
  state: await surfaceState(),
  requests: requests.splice(0),
});

for (const route of routes) {
  guard(`start ${route}`);
  requests = [];
  const t0 = Date.now();

  // Click the sidebar link, the way a user navigates.
  const link = page.locator(`a[href="${route}"]`).first();
  const canClick = (await link.count()) > 0;

  if (canClick) {
    await link.click();
  } else {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 180000 });
  }

  // Poll every 250 ms so we can see when real content lands and whether a
  // skeleton was ever on screen.
  let firstContentMs = null;
  let sawSkeleton = false;
  const deadline = Date.now() + 45000;

  while (Date.now() < deadline) {
    await page.waitForTimeout(250);
    const s = await surfaceState();
    if (s.skeletons > 0) sawSkeleton = true;
    if (firstContentMs === null && (s.rows > 0 || s.cards > 0) && !s.err) {
      firstContentMs = Date.now() - t0;
      break;
    }
    if (s.err) {
      firstContentMs = Date.now() - t0;
      break;
    }
  }

  await settle(3000);
  results.push({
    step: canClick ? `click ${route}` : `goto ${route}`,
    url: page.url(),
    msToContent: firstContentMs,
    sawSkeleton,
    state: await surfaceState(),
    requests: requests.splice(0),
  });
}

// Revisit the first route: this is the "go back again" case.
const revisit = routes[0];
if (revisit) {
  requests = [];
  const t0 = Date.now();
  const link = page.locator(`a[href="${revisit}"]`).first();
  const canClick = (await link.count()) > 0;
  if (canClick) await link.click();
  else await page.goto(BASE + revisit, { waitUntil: "domcontentloaded", timeout: 180000 });

  let firstContentMs = null;
  let sawSkeleton = false;
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    await page.waitForTimeout(250);
    const s = await surfaceState();
    if (s.skeletons > 0) sawSkeleton = true;
    if (firstContentMs === null && (s.rows > 0 || s.cards > 0) && !s.err) {
      firstContentMs = Date.now() - t0;
      break;
    }
    if (s.err) {
      firstContentMs = Date.now() - t0;
      break;
    }
  }
  await settle(3000);
  results.push({
    step: `REVISIT ${revisit}`,
    url: page.url(),
    msToContent: firstContentMs,
    sawSkeleton,
    state: await surfaceState(),
    requests: requests.splice(0),
  });
}

console.log(JSON.stringify({ base: BASE, results, pageErrors }, null, 2));
await context.close();
