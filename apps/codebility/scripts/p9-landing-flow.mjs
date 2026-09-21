// Reproduces the landing-page codev pagination flow the user reported: load the
// public landing page, click through pages, and record every /api/landing-interns
// response status plus any page errors.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P9_BASE ?? "http://localhost:3001";
const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p9-landing-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

const apiCalls = [];
const pageErrors = [];
page.on("response", async (r) => {
  if (!r.url().includes("/api/landing-interns")) return;
  let bodyPreview = "";
  try {
    bodyPreview = (await r.text()).slice(0, 120);
  } catch {
    bodyPreview = "<unreadable>";
  }
  apiCalls.push({ url: r.url(), status: r.status(), body: bodyPreview });
});
page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 200)));

// Warm.
await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(6000);

const before = apiCalls.length;

// The landing pagination renders Prev/Next chevrons and a "Page X of Y" label.
const nextBtn = page
  .locator("button")
  .filter({ has: page.locator("svg.lucide-chevron-right") })
  .last();

const clicks = [];
for (let i = 0; i < 3; i++) {
  const count = await nextBtn.count();
  if (!count) {
    clicks.push({ step: i + 1, clicked: false, reason: "no next button" });
    break;
  }
  await nextBtn.click({ timeout: 10000 }).catch((e) => {
    clicks.push({ step: i + 1, clicked: false, reason: String(e).slice(0, 120) });
  });
  await page.waitForTimeout(3500);
  const label = await page
    .locator("text=/Page \\d+ of \\d+/")
    .first()
    .textContent()
    .catch(() => null);
  clicks.push({ step: i + 1, clicked: true, label: label?.trim() ?? null });
}

console.log(
  JSON.stringify(
    {
      base: BASE,
      clicks,
      apiCalls: apiCalls.slice(before),
      pageErrors,
    },
    null,
    2,
  ),
);
await context.close();
