// Counts the duplicate first-page fetch on every paginated route: load the
// route directly, and report any server-action POST that arrives within a few
// seconds of a fresh document load. On a correct implementation page 1 comes
// from the server render and no action fires until the user interacts.
//
//   node scripts/preview-firstload.mjs /home/in-house /home/projects ...
import path from "node:path";
import os from "node:os";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-22ly08bdz-zeff01s-projects.vercel.app";
const routes = process.argv.slice(2);

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

let actions = [];
page.on("request", (r) => {
  if (!r.url().startsWith(BASE)) return;
  if (!(r.method() === "POST" && r.headers()["next-action"])) return;
  actions.push({
    url: r.url().replace(BASE, ""),
    body: (r.postData() ?? "").slice(0, 100),
  });
});

const settle = (ms) => page.waitForTimeout(ms);

// Warm the origin once so we are not measuring a cold CDN fetch.
await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 180000 });
await settle(10000);

const out = [];
for (const route of routes) {
  actions = [];
  const t0 = Date.now();
  // Hard navigation: this is what the server-render contract is about.
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 180000 });
  await settle(8000);
  out.push({
    route,
    ms: Date.now() - t0,
    duplicateFirstPageFetches: actions.length,
    actions,
  });
}

console.log(JSON.stringify(out, null, 2));
await context.close();
