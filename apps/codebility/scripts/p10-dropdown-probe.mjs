// Tests a select/combobox filter end to end: does choosing an option issue a
// request and change the rows? Complements the search probe.
//
// The verdict reports two separate facts rather than one blended one, because
// option index 1 of the first combobox can legitimately equal the current value
// (picking the status the rows already have changes nothing):
//   requestIssued  -> the filter is wired to the server at all
//   rowsChanged    -> the visible result actually re-rendered
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/in-house";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";
const OPTION_INDEX = Number(process.argv[3] ?? 1);

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p10-profile");
fs.rmSync(PROFILE, { recursive: true, force: true });
if (fs.existsSync(SHARED)) fs.cpSync(SHARED, PROFILE, { recursive: true });

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
  if (r.method() === "POST" && h["next-action"]) reqs.push("action");
  else if (/\/api\//.test(r.url())) reqs.push("api");
});

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(12000);

const rowSignature = () =>
  page.evaluate(() =>
    [...document.querySelectorAll("tbody tr")]
      .map((r) => r.innerText.replace(/\s+/g, " ").slice(0, 50))
      .join("|"),
  );

const rowsBefore = await page.locator("tbody tr").count();
const sigBefore = await rowSignature();

const combo = page.locator('[role="combobox"]:visible').first();
const comboFound = (await combo.count()) > 0;
let picked = null;
let pickedIndex = null;
let optionsSeen = 0;

reqs.length = 0;
if (comboFound) {
  await combo.click();
  await page.waitForTimeout(1200);
  const opts = page.locator('[role="option"]:visible');
  optionsSeen = await opts.count();
  if (optionsSeen > OPTION_INDEX) {
    picked = (await opts.nth(OPTION_INDEX).innerText().catch(() => null))?.trim().slice(0, 30) ?? null;
    pickedIndex = OPTION_INDEX;
    await opts.nth(OPTION_INDEX).click();
    await page.waitForTimeout(5000);
  }
}

const rowsAfter = await page.locator("tbody tr").count();
const sigAfter = await rowSignature();

console.log(
  JSON.stringify(
    {
      route,
      comboFound,
      optionsSeen,
      optionPickedIndex: pickedIndex,
      optionPicked: picked,
      rowsBefore,
      rowsAfter,
      requestsAfterPick: reqs.length,
      rowsChanged: sigAfter !== sigBefore,
      pageErrors: errors,
      verdict:
        picked === null
          ? "could not pick an option"
          : reqs.length === 0
            ? "FAIL: filter changed but NO server request was issued"
            : sigAfter === sigBefore
              ? "SUSPECT: request issued but table unchanged"
              : "PASS: filter refetched and table changed",
    },
    null,
    2,
  ),
);
await context.close();
