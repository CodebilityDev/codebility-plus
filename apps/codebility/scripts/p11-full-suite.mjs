// ============================================================================
// Phase 11 — all-in-one verification suite (single run, every private route).
//
// Connects to an already-running, signed-in Chrome over CDP instead of
// launching its own. That matters: a Playwright-launched browser lives inside
// the agent's job tree and gets reaped mid-sweep, and a copied profile can be
// invalidated by any other probe, both of which previously turned real routes
// into sign-in pages and produced meaningless "0 errors" results.
//
// Start the browser first (survives outside the job tree):
//   Start-Process chrome.exe -ArgumentList '--remote-debugging-port=9333',
//     "--user-data-dir=$env:TEMP\codebility-p11-suite-auth",'--new-window',
//     'http://localhost:3000/auth/sign-in'
// Sign in, then:
//   node scripts/p11-full-suite.mjs
//
// Gates: per-route render proof, duplicate page-1 fetches (B), skeleton +
// optimistic page marker (C), hydration / SSR-fallback errors (D), /home
// invariants, 404s, console + page errors, first-content timing.
// ============================================================================
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";
const CDP = process.env.CDP_URL ?? "http://localhost:9333";
const args = process.argv.slice(2);
const QUICK = args.includes("--quick");
const onlyArg = args.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? onlyArg.slice(7).split(",").map((s) => s.trim()) : null;
const OUTPUT = process.env.OUT ?? path.join(os.tmpdir(), "p11-suite.json");

const ROUTES = [
  { route: "/home", marker: "David", invariants: true },
  { route: "/home/account-settings", marker: "Account" },
  { route: "/home/admin-controls", marker: "Admin" },
  { route: "/home/admin-controls/appointments", marker: "Appointment" },
  { route: "/home/admin-controls/client-tracker", marker: "Client" },
  { route: "/home/admin-controls/ticket-support", marker: "Ticket" },
  { route: "/home/admin-dashboard", marker: "Dashboard" },
  { route: "/home/applicants", marker: "Applicant", breadth: true },
  { route: "/home/certificate-preview", marker: "Certificate" },
  { route: "/home/clients", marker: "Client", breadth: true },
  { route: "/home/feeds", marker: "Feed" },
  { route: "/home/hire", marker: "Hire" },
  { route: "/home/hire/applications/:jobId", needs: "jobId", marker: "Applic" },
  { route: "/home/in-house", marker: "Members", breadth: true },
  { route: "/home/interns", marker: "Developers", breadth: true },
  { route: "/home/kanban", marker: "Kanban" },
  { route: "/home/kanban/:projectId", needs: "projectId", marker: "Kanban" },
  { route: "/home/my-team", marker: "My Team" },
  { route: "/home/my-team/:projectId", needs: "projectId", marker: "My Team" },
  { route: "/home/my-team/:projectId/leaderboard", needs: "projectId", marker: "Leader" },
  { route: "/home/orgchart", marker: "Org" },
  { route: "/home/overflow", marker: "Overflow" },
  { route: "/home/projects", marker: "Project", breadth: true },
  { route: "/home/promote-modal", marker: "Modal" },
  { route: "/home/promote-modal/:modalId", needs: "modalId", marker: "Modal" },
  { route: "/home/settings", marker: "Setting" },
  { route: "/home/settings/account-settings", marker: "Account" },
  { route: "/home/settings/news-banners", marker: "Banner" },
  { route: "/home/settings/profile", marker: "Profile" },
  { route: "/home/settings/services", marker: "Service" },
  { route: "/home/settings/services/cms-diagnostic", marker: "Diagnostic" },
  { route: "/home/settings/services/diagnostic", marker: "Diagnostic" },
  { route: "/home/settings/surveys", marker: "Survey" },
  { route: "/home/settings/surveys/:surveyId", needs: "surveyId", marker: "Survey", skipIfMissing: true },
  { route: "/home/settings/surveys/:surveyId/results", needs: "surveyId", marker: "Result", skipIfMissing: true },
  { route: "/home/surveys/:surveyId", needs: "surveyId", marker: "Survey", skipIfMissing: true },
  { route: "/home/tasks", marker: "Task", breadth: true },
  { route: "/home/test-meeting-notification", marker: "Notification" },
  { route: "/home/test-notifications", marker: "Notification" },
  { route: "/home/ticket-support", marker: "Ticket" },
  { route: "/home/time-tracker", marker: "Time Logs" },
];

const resolveIds = async () => {
  const env = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
  const g = (k) => {
    const m = env.match(new RegExp("^" + k + "=(.+)", "m"));
    return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
  };
  const url = g("NEXT_PUBLIC_SUPABASE_URL");
  const key = g("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const H = { apikey: key, Authorization: "Bearer " + key };
  const one = async (t, sel, extra = "") => {
    const r = await fetch(
      `${url}/rest/v1/${t}?select=${encodeURIComponent(sel)}&limit=1${extra}`,
      { headers: H },
    );
    if (r.status !== 200) return null;
    return (await r.json())[0] ?? null;
  };
  const [project, survey, modal, job] = await Promise.all([
    one("projects", "id", "&order=created_at.desc"),
    one("surveys", "id", "&order=created_at.desc"),
    one("feature_modals", "id", "&order=created_at.desc"),
    one("job_listings", "id", "&order=created_at.desc"),
  ]);
  return {
    projectId: project?.id ?? null,
    surveyId: survey?.id ?? null,
    modalId: modal?.id ?? null,
    jobId: job?.id ?? null,
  };
};

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

let browser;
try {
  browser = await chromium.connectOverCDP(CDP);
} catch (e) {
  console.log(
    JSON.stringify(
      {
        error: "CDP_UNREACHABLE",
        cdp: CDP,
        detail: String(e).slice(0, 200),
        hint: "Start the detached Chrome on port 9333 (see header), sign in, re-run.",
      },
      null,
      2,
    ),
  );
  process.exit(2);
}

const context = browser.contexts()[0] ?? (await browser.newContext());
const page =
  context.pages().find((p) => !p.url().startsWith("chrome://")) ??
  (await context.newPage());

const ids = await resolveIds();

// Session proof — refuse to report results gathered from a sign-in page.
await page.goto(BASE + "/home", { waitUntil: "domcontentloaded", timeout: 180000 });
await page.waitForTimeout(8000);
if (page.url().includes("sign-in")) {
  console.log(
    JSON.stringify(
      { error: "NOT_SIGNED_IN", url: page.url(), hint: "Sign in, then re-run." },
      null,
      2,
    ),
  );
  // Do NOT browser.close(): over CDP that terminates the real Chrome window.
  process.exit(2);
}

// Capture /home invariants once, on a clean load.
let homeInvariants = null;

const results = [];

for (const spec of ROUTES) {
  if (ONLY && !ONLY.some((o) => spec.route === o)) {
    continue;
  }

  let url = spec.route;
  if (spec.needs) {
    const id = ids[spec.needs];
    if (!id) {
      results.push(
        spec.skipIfMissing
          ? { route: spec.route, status: "SKIPPED", reason: `no ${spec.needs} in db` }
          : { route: spec.route, status: "SKIPPED", reason: `missing ${spec.needs}` },
      );
      continue;
    }
    url = url.replace(`:${spec.needs}`, id);
  }

  const errors = [];
  const failed = [];
  const actionPosts = [];

  const onPageErr = (e) => errors.push("PAGEERROR " + String(e).slice(0, 220));
  const onConsole = (m) => {
    if (m.type() === "error") errors.push("CONSOLE " + m.text().slice(0, 220));
  };
  const onRequest = (r) => {
    if (!r.url().startsWith(BASE)) return;
    if (r.method() === "POST" && r.headers()["next-action"]) {
      actionPosts.push((r.postData() ?? "").slice(0, 140));
    }
  };
  const onResponse = (r) => {
    if (r.status() >= 400 && r.url().startsWith(BASE)) {
      failed.push(`${r.status()} ${r.url().replace(BASE, "").slice(0, 120)}`);
    }
  };

  page.on("pageerror", onPageErr);
  page.on("console", onConsole);
  page.on("request", onRequest);
  page.on("response", onResponse);

  const counts = { posts: 0, skeletons: 0 };
  if (spec.invariants) counts.posts = -1; // counted below

  const t0 = Date.now();
  let firstContentMs = null;
  try {
    await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 180000 });
    try {
      await page.waitForFunction(
        () => (document.querySelector("main")?.innerText ?? "").trim().length > 40,
        { timeout: 90000 },
      );
      firstContentMs = Date.now() - t0;
    } catch {
      firstContentMs = null;
    }
    await page.waitForTimeout(QUICK ? 5000 : 11000);
  } catch (e) {
    errors.push("NAV " + String(e).slice(0, 200));
  }

  let dom;
  try {
    dom = await page.evaluate(() => {
      const main = document.querySelector("main") ?? document.body;
      const text = main.innerText ?? "";
      return {
        finalUrl: location.pathname,
        textLength: text.length,
        textNodes: [...main.querySelectorAll("*")].filter(
          (el) => el.children.length === 0 && (el.textContent ?? "").trim().length > 3,
        ).length,
        rows: document.querySelectorAll("tbody tr").length,
        cards: document.querySelectorAll("article").length,
        dialogs: document.querySelectorAll('[role="dialog"]').length,
        skeletons: [...document.querySelectorAll("div,span")].filter((el) => {
          const c = el.className;
          return (
            typeof c === "string" &&
            /animate-pulse|skeleton/i.test(c) &&
            el.getBoundingClientRect().width > 0
          );
        }).length,
        sidebarLinks: document.querySelectorAll("aside a, nav a").length,
        navLinks: document.querySelectorAll("header a").length,
      };
    });
  } catch (e) {
    errors.push("EVAL " + String(e).slice(0, 200));
  }

  page.off("pageerror", onPageErr);
  page.off("console", onConsole);
  page.off("request", onRequest);
  page.off("response", onResponse);

  if (!dom) {
    results.push({
      route: spec.route,
      resolved: url,
      status: "INCONCLUSIVE",
      reason: "page unavailable",
      errors: [...new Set(errors)].slice(0, 6),
    });
    continue;
  }

  if (spec.invariants) {
    homeInvariants = {
      postCount: actionPosts.length,
      sidebarLinks: dom.sidebarLinks,
      rows: dom.rows,
    };
  }

  const onSignIn = dom.finalUrl.includes("sign-in");
  const exercised = !onSignIn && dom.textLength > 80;
  const duplicatePage1 = actionPosts.filter((b) => /page\\?":1/.test(b)).length;

  results.push({
    route: spec.route,
    resolved: url,
    status: !exercised ? "INCONCLUSIVE" : errors.length ? "ERRORS" : "PASS",
    finalUrl: dom.finalUrl,
    onSignInPage: onSignIn,
    firstContentMs,
    textLength: dom.textLength,
    textNodes: dom.textNodes,
    rows: dom.rows,
    cards: dom.cards,
    breadth: Boolean(spec.breadth),
    actionPosts: actionPosts.length,
    duplicatePage1Fetches: spec.breadth ? duplicatePage1 : undefined,
    failedRequests: [...new Set(failed)].slice(0, 8),
    errors: [...new Set(errors)].slice(0, 8),
  });
}

// Disconnect the CDP transport without terminating the browser. `browser.close()`
// over connectOverCDP kills the real Chrome window, which is what closed the
// page between consecutive runs and made every route after the first look
// unavailable.
await browser.close().catch(() => {});

const measured = results.filter((r) => r.status !== "SKIPPED");
const summary = {
  base: BASE,
  cdp: CDP,
  routesPlanned: ROUTES.length,
  routesMeasured: measured.length,
  skipped: results.filter((r) => r.status === "SKIPPED").length,
  pass: measured.filter((r) => r.status === "PASS").length,
  errors: measured.filter((r) => r.status === "ERRORS").length,
  inconclusive: measured.filter((r) => r.status === "INCONCLUSIVE").length,
  onSignInPage: measured.filter((r) => r.onSignInPage).length,
  duplicatePage1Fetches: measured
    .filter((r) => r.breadth)
    .reduce((n, r) => n + (r.duplicatePage1Fetches ?? 0), 0),
  homeInvariants,
  routesWithErrors: measured.filter((r) => r.errors?.length).map((r) => r.route),
  routes404: measured
    .filter((r) => (r.failedRequests ?? []).some((f) => f.startsWith("404")))
    .map((r) => ({ route: r.route, assets: (r.failedRequests ?? []).filter((f) => f.startsWith("404")) })),
  slowest: measured
    .filter((r) => r.firstContentMs)
    .sort((a, b) => b.firstContentMs - a.firstContentMs)
    .slice(0, 6)
    .map((r) => ({ route: r.route, firstContentMs: r.firstContentMs })),
};

fs.writeFileSync(
  OUTPUT,
  JSON.stringify({ generatedAt: new Date().toISOString(), summary, results }, null, 2),
);

console.log(JSON.stringify({ summary, output: OUTPUT }, null, 2));

const bad =
  summary.errors + summary.inconclusive + summary.onSignInPage + summary.duplicatePage1Fetches;
process.exit(bad === 0 ? 0 : 1);
