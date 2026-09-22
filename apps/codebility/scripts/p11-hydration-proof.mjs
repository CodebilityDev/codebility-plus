// Hydration check with a proof-of-render gate.
//
// The previous probes reported "0 errors" while the browser sat on the sign-in
// page: with no data there is nothing to mismatch, so an empty error list proved
// nothing. This probe refuses to report a pass unless the route demonstrably
// rendered its own content first — verified by an expected marker string AND a
// non-trivial row/card count — and it reports the final URL so a redirect to
// /auth/sign-in is visible rather than silent.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";

// route -> { marker: text that only appears on the real page, kind: what to count }
const TARGETS = [
  { route: "/home/tasks", marker: "task", count: "tbody tr, article" },
  {
    route: "/home/my-team/e2e1a591-3032-4ece-9b81-570a358190bc",
    marker: "My Team",
    count: "tbody tr, article",
  },
  { route: "/home/in-house", marker: "Members", count: "tbody tr" },
];

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-hydproof");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

const out = [];
for (const { route, marker, count } of TARGETS) {
  const errs = [];
  const onErr = (e) => errs.push("PAGEERROR " + String(e).slice(0, 240));
  const onCon = (m) => {
    if (m.type() === "error") errs.push("CONSOLE " + m.text().slice(0, 240));
  };
  page.on("pageerror", onErr);
  page.on("console", onCon);

  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 180000 });
  await page.waitForTimeout(14000);

  const info = await page.evaluate(
    ({ marker, count }) => {
      const text = document.body.innerText;
      const sel = count.split(",").map((s) => s.trim());
      const rendered = sel.reduce(
        (n, s) => n + document.querySelectorAll(s).length,
        0,
      );
      // Many of these routes render cards/lists rather than table rows, so a
      // structural count alone under-reports. Count DOM nodes that carry real
      // text inside the main region instead.
      const main = document.querySelector("main") ?? document.body;
      const textNodes = [...main.querySelectorAll("*")].filter(
        (el) =>
          el.children.length === 0 && (el.textContent ?? "").trim().length > 3,
      ).length;
      return {
        finalUrl: location.pathname,
        markerFound: text.toLowerCase().includes(marker.toLowerCase()),
        structuredNodes: rendered,
        textNodes,
        textLength: text.length,
      };
    },
    { marker, count },
  );

  page.off("pageerror", onErr);
  page.off("console", onCon);

  // A route only counts as exercised when it left the sign-in page, rendered its
  // own content, and produced a meaningful amount of text. Otherwise errors:[]
  // is not evidence.
  const exercised =
    !info.finalUrl.includes("sign-in") &&
    info.markerFound &&
    (info.structuredNodes > 0 || info.textNodes > 20);

  out.push({
    route,
    ...info,
    exercised,
    verdict: exercised
      ? errs.length === 0
        ? "PASS"
        : "FAIL(hydration errors on a rendered page)"
      : "INCONCLUSIVE(route never rendered)",
    errors: errs,
  });
}

console.log(JSON.stringify(out, null, 2));
await context.close();
