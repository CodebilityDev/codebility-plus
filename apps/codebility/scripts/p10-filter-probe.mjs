// Proves the filter/search contract at runtime, which the page-only probe missed.
// Types N characters into a route's search box and counts server requests.
// Correct behaviour: ONE request after the user stops typing, not one per key.
// Usage: P10_BASE=http://localhost:3000 node scripts/p10-filter-probe.mjs /home/in-house
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/in-house";
const TERM = process.argv[3] ?? "develop";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p10-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));

const reqs = [];
page.on("request", (r) => {
  const h = r.headers();
  if (r.method() === "POST" && h["next-action"]) reqs.push({ t: Date.now(), kind: "action" });
  else if (/\/api\//.test(r.url())) reqs.push({ t: Date.now(), kind: "api" });
});

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(12000);

// Responsive layouts render BOTH a mobile and a desktop search box; only one is
// visible. `.first()` silently picks the hidden one, so match on :visible.
const search = page.locator('input[placeholder*="earch" i]:visible').first();

const found = (await search.count()) > 0 && (await search.isVisible().catch(() => false));
let result = { route, searchFound: found };

if (found) {
  const rowsBefore = await page.locator("tbody tr").count();
  reqs.length = 0;

  // Real keystrokes, human-ish cadence. A debounced field must collapse these.
  await search.click();
  await search.pressSequentially(TERM, { delay: 90 });
  const typedAt = Date.now();
  const valueAfterTyping = await search.inputValue();

  // Wait well past any reasonable debounce window.
  await page.waitForTimeout(4000);

  const duringTyping = reqs.filter((r) => r.t <= typedAt).length;
  const total = reqs.length;

  // Skeleton must appear while the filtered result is in flight.
  const sawSkeleton = await page.evaluate(
    () =>
      [...document.querySelectorAll(".animate-pulse")].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.height >= 24 && r.width >= 120;
      }).length,
  );

  const rowsAfter = await page.locator("tbody tr").count();

  result = {
    ...result,
    chars: TERM.length,
    valueAfterTyping,
    inputAcceptedText: valueAfterTyping === TERM,
    rowsBefore,
    rowsAfter,
    filterActuallyApplied: rowsAfter !== rowsBefore,
    requestsDuringTyping: duringTyping,
    requestsTotal: total,
    requestsPerChar: +(total / TERM.length).toFixed(2),
    settledSkeletonBlocks: sawSkeleton,
    verdict:
      total <= 1
        ? "PASS (debounced to <=1 request)"
        : total < TERM.length
          ? `PARTIAL (${total} requests for ${TERM.length} chars)`
          : `FAIL (${total} requests for ${TERM.length} chars - one per keystroke)`,
  };
}

result.pageErrors = errors;
console.log(JSON.stringify(result, null, 2));
await context.close();
