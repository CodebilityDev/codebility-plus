// Decides whether a filter is actually honoured, by comparing row identity and
// the reported total before/after, instead of just the row count (which cannot
// change when a filter still returns >= pageSize rows).
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/in-house";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-truth-profile");
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

// Capture the server action response bodies so we can see what the server sent.
const bodies = [];
page.on("response", async (r) => {
  const req = r.request();
  if (req.method() !== "POST") return;
  if (!req.headers()["next-action"]) return;
  try {
    const t = await r.text();
    bodies.push(t.slice(0, 4000));
  } catch {}
});

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(13000);

const snap = () =>
  page.evaluate(() => {
    const rows = [...document.querySelectorAll("tbody tr")];
    const txt = document.body.innerText;
    return {
      rowCount: rows.length,
      firstThree: rows.slice(0, 3).map((r) => r.innerText.replace(/\s+/g, " ").slice(0, 44)),
      // Most tables print "N results" / "of N" somewhere.
      totalLabel: (txt.match(/(\d+)\s*(results?|records?|total|items?)/i) ?? [])[0] ?? null,
    };
  });

const before = await snap();
bodies.length = 0;

// Pick the 2nd option of the first visible combobox.
const combo = page.locator('[role="combobox"]:visible').first();
let picked = null;
if (await combo.count()) {
  await combo.click();
  await page.waitForTimeout(1200);
  const opts = page.locator('[role="option"]:visible');
  if ((await opts.count()) > 1) {
    picked = (await opts.nth(1).innerText().catch(() => ""))?.trim().slice(0, 30) || null;
    await opts.nth(1).click();
    await page.waitForTimeout(6000);
  }
}

const after = await snap();

// Did the server response carry a different total than the initial render?
const totalsInBodies = [
  ...new Set(
    bodies
      .flatMap((b) => [...b.matchAll(/"total"\s*:\s*(\d+)/g)].map((m) => Number(m[1])))
      .filter(Number.isFinite),
  ),
];

const identityChanged =
  JSON.stringify(before.firstThree) !== JSON.stringify(after.firstThree);

console.log(
  JSON.stringify(
    {
      route,
      optionPicked: picked,
      requestsCaptured: bodies.length,
      totalsReportedByServer: totalsInBodies,
      before,
      after,
      rowIdentityChanged: identityChanged,
      verdict:
        picked === null
          ? "could not pick an option"
          : bodies.length === 0
            ? "FAIL: no server request"
            : identityChanged
              ? "PASS: server returned a different result set"
              : totalsInBodies.length > 0
                ? `SUSPECT: server responded (total=${totalsInBodies.join("/")}) but visible rows are identical`
                : "SUSPECT: responded but result set looks identical",
      pageErrors: errors,
    },
    null,
    2,
  ),
);
await context.close();
