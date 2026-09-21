// Quantifies the duplicate first-page fetch on every route that uses
// usePaginatedQuery. Hard-loads each route, waits for it to go fully idle, and
// reports server-action POSTs that carry a page:1 payload (i.e. the client
// re-requesting what the server already rendered).
//
//   node scripts/preview-dupfetch.mjs
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-22ly08bdz-zeff01s-projects.vercel.app";

const ROUTES = [
  "/home/in-house",
  "/home/interns",
  "/home/projects",
  "/home/clients",
  "/home/tasks",
  "/home/applicants",
];

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
  actions.push({ at: Date.now(), body: (r.postData() ?? "").slice(0, 130) });
});

const settle = (ms) => page.waitForTimeout(ms);

await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 180000 });
await settle(9000);

const out = [];
for (const route of ROUTES) {
  actions = [];
  // Fresh document load, then hands off. Nothing else is touched.
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 180000 });
  const t0 = Date.now();
  await settle(16000);

  const rows = await page.evaluate(() => document.querySelectorAll("tbody tr").length);
  const page1 = actions.filter((a) => /page\\?":1/.test(a.body));
  const layout = actions.filter((a) => a.body === "[]");

  out.push({
    route,
    rowsRendered: rows,
    totalActions: actions.length,
    layoutActions: layout.length,
    duplicatePage1Fetches: page1.length,
    duplicateDetail: page1.map((a) => ({
      afterMs: a.at - t0,
      body: a.body,
    })),
  });
}

console.log(JSON.stringify(out, null, 2));
await context.close();
