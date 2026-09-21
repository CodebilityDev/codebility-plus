// Walks every private /home route on the production preview and records, per
// route: load time, duplicate page-1 server-action fetches, RSC prefetch count,
// skeleton paint, rendered-content signal, and any error surfaced either as a
// pageerror or as "something went wrong" copy in the DOM.
//
// Read-only. Writes a JSON report next to the script.
//
//   node scripts/preview-all-routes.mjs
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-22ly08bdz-zeff01s-projects.vercel.app";

// Static routes only. Dynamic segments are handled separately with real ids.
const ROUTES = [
  "/home",
  "/home/account-settings",
  "/home/admin-controls",
  "/home/admin-controls/appointments",
  "/home/admin-controls/client-tracker",
  "/home/admin-controls/ticket-support",
  "/home/admin-dashboard",
  "/home/applicants",
  "/home/certificate-preview",
  "/home/clients",
  "/home/feeds",
  "/home/hire",
  "/home/in-house",
  "/home/interns",
  "/home/kanban",
  "/home/my-team",
  "/home/orgchart",
  "/home/overflow",
  "/home/projects",
  "/home/promote-modal",
  "/home/settings",
  "/home/settings/account-settings",
  "/home/settings/news-banners",
  "/home/settings/profile",
  "/home/settings/services",
  "/home/settings/services/cms-diagnostic",
  "/home/settings/services/diagnostic",
  "/home/settings/surveys",
  "/home/tasks",
  "/home/test-meeting-notification",
  "/home/test-notifications",
  "/home/ticket-support",
  "/home/time-tracker",
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

// ---- collectors ----------------------------------------------------------
let events = [];
page.on("request", (r) => {
  const url = r.url();
  if (!url.startsWith(BASE)) return;
  if (/_next\/static|\.(png|jpg|jpeg|svg|webp|ico|woff2?)($|\?)/i.test(url)) return;
  const isAction = r.method() === "POST" && r.headers()["next-action"];
  const rel = url.replace(BASE, "");
  if (/\/_next\/image/.test(rel)) return;
  events.push({
    kind: isAction ? "action" : /_rsc=/.test(rel) ? "prefetch" : "doc",
    rel,
    body: isAction ? (r.postData() ?? "").slice(0, 90) : undefined,
  });
});

let pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 200)));

let consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
});

const surface = () =>
  page.evaluate(() => {
    const text = document.body.innerText.replace(/\s+/g, " ").trim();
    const skeletons = [...document.querySelectorAll(".animate-pulse")].filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width >= 120 && r.height >= 24;
    }).length;
    return {
      len: text.length,
      skeletons,
      rows: document.querySelectorAll("tbody tr").length,
      cards: document.querySelectorAll("article").length,
      // Positive error surface: Next's error boundary copy.
      errText:
        /something went wrong|application error|unable to load|failed to load|internal server error|a client-side exception/i.test(
          text,
        )
          ? text.match(
              /.{0,60}(something went wrong|application error|unable to load|failed to load|internal server error|a client-side exception).{0,70}/i,
            )?.[0]
          : null,
      head: text.slice(0, 70),
    };
  });

const settle = (ms) => page.waitForTimeout(ms);

// Warm the shell once.
await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 180000 });
await settle(9000);

const report = [];

for (const route of ROUTES) {
  events = [];
  pageErrors = [];
  consoleErrors = [];
  const t0 = Date.now();

  try {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 180000 });
  } catch (error) {
    report.push({ route, navigationFailed: String(error).slice(0, 160) });
    continue;
  }

  // Watch for a skeleton and for content to settle.
  let sawSkeleton = false;
  let firstContentMs = null;
  const deadline = Date.now() + 40000;

  while (Date.now() < deadline) {
    await settle(400);
    const s = await surface();
    if (s.skeletons > 0) sawSkeleton = true;
    if (firstContentMs === null && s.len > 400) firstContentMs = Date.now() - t0;
    if (s.errText) break;
  }

  await settle(2500);

  const finalState = await surface();
  const actionEvents = events.filter((e) => e.kind === "action");
  // A duplicate page-1 fetch is an action whose payload names page:1.
  const duplicateFetches = actionEvents.filter((e) => /page\\?":1/.test(e.body ?? ""));

  report.push({
    route,
    finalUrl: page.url().replace(BASE, ""),
    redirected: page.url().replace(BASE, "") !== route,
    ms: Date.now() - t0,
    firstContentMs,
    sawSkeleton,
    actions: actionEvents.length,
    duplicatePage1Fetches: duplicateFetches.length,
    duplicateBodies: duplicateFetches.map((e) => e.body),
    prefetches: events.filter((e) => e.kind === "prefetch").length,
    state: finalState,
    pageErrors,
    consoleErrors: consoleErrors.slice(0, 3),
  });
}

const outPath = path.resolve("scripts", "preview-routes-report.json");
fs.writeFileSync(outPath, JSON.stringify({ base: BASE, report }, null, 2));

// Console summary.
for (const r of report) {
  if (r.navigationFailed) {
    console.log(`${r.route.padEnd(42)} NAV FAILED  ${r.navigationFailed}`);
    continue;
  }
  const flags = [];
  if (r.redirected) flags.push(`-> ${r.finalUrl}`);
  if (r.duplicatePage1Fetches) flags.push(`DUP x${r.duplicatePage1Fetches}`);
  if (r.sawSkeleton) flags.push("skeleton");
  if (r.pageErrors.length) flags.push(`pageerror x${r.pageErrors.length}`);
  if (r.consoleErrors.length) flags.push(`consoleErr x${r.consoleErrors.length}`);
  if (r.state.errText) flags.push("ERR-TEXT");
  if (r.state.rows === 0 && r.state.cards === 0 && r.state.len < 300) flags.push("EMPTY");
  console.log(
    `${r.route.padEnd(42)} ${String(r.ms).padStart(6)}ms  pf=${String(r.prefetches).padStart(2)}  ${flags.join(" | ")}`,
  );
}

console.log(`\nFull report: ${outPath}`);
await context.close();
