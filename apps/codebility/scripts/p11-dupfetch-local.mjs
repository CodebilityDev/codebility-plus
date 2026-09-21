// Local twin of preview-dupfetch.mjs, for verifying workstream B before deploy.
// Hard-loads each paginated route on the dev server, leaves it idle, and counts
// server-action POSTs carrying a page:1 payload (the client re-requesting what
// the server already rendered).
//
//   node scripts/p11-dupfetch-local.mjs
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P11_BASE ?? "http://localhost:3000";

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

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-dup");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

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

await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 300000 });
await settle(8000);

const out = [];
for (const route of ROUTES) {
  actions = [];
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
  const t0 = Date.now();
  await settle(14000);

  const rows = await page.evaluate(() => document.querySelectorAll("tbody tr").length);
  const page1 = actions.filter((a) => /page\\?":1/.test(a.body));
  const layout = actions.filter((a) => a.body === "[]");

  out.push({
    route,
    rowsRendered: rows,
    totalActions: actions.length,
    layoutActions: layout.length,
    duplicatePage1Fetches: page1.length,
    duplicateDetail: page1.map((a) => ({ afterMs: a.at - t0, body: a.body })),
  });
}

console.log(JSON.stringify(out, null, 2));
await context.close();
