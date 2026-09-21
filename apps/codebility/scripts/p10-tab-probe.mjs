// Clicks a category tab on a card-grid route and asserts the server refetches.
// Card grids have no tbody, so it compares the rendered card signature.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/projects";
const TAB_LABEL = process.argv[3] ?? "Web Application";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p10-tab");
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
});

const cardSig = () =>
  page.evaluate(() =>
    [...document.querySelectorAll(".grid > *")]
      .map((c) => (c.innerText || "").replace(/\s+/g, " ").slice(0, 50))
      .join("|"),
  );

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(14000);

const sigBefore = await cardSig();
const cardsBefore = (await page.locator(".grid > *").count()) || 0;

reqs.length = 0;
await page.getByRole("button", { name: TAB_LABEL, exact: true }).first().click();
await page.waitForTimeout(6000);

const sigAfter = await cardSig();
const cardsAfter = (await page.locator(".grid > *").count()) || 0;

console.log(
  JSON.stringify(
    {
      route,
      tab: TAB_LABEL,
      cardsBefore,
      cardsAfter,
      requestsAfterTab: reqs.length,
      cardsChanged: sigBefore !== sigAfter,
      pageErrors: errors,
      verdict:
        reqs.length === 0
          ? "FAIL: tab changed but NO server request was issued"
          : sigBefore === sigAfter
            ? "SUSPECT: request issued but cards unchanged"
            : "PASS: tab refetched and cards changed",
    },
    null,
    2,
  ),
);
await context.close();
