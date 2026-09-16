// Measures client-side navigation latency: the thing the user reports as slow
// when clicking a sidebar link, versus a full page load of the same URL.
//
// Usage: node scripts/nav-probe.mjs [--click="Services"] [--seconds=20]
import path from "node:path";
import os from "node:os";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-probe-profile");
const arg = (name, fallback) =>
  (process.argv.find((a) => a.startsWith(`--${name}=`)) ?? `--${name}=${fallback}`).split("=")[1];

const linkText = arg("click", "Kanban");
const budget = Number(arg("seconds", 20));

const browser = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  channel: "chrome",
  viewport: null,
});
const page = browser.pages()[0] ?? (await browser.newPage());

await page.goto("http://localhost:3000/home", { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForTimeout(6000);

const before = page.url();

// Client-side navigation: click the sidebar link and time until the URL changes.
const link = page.locator(`aside a:has-text("${linkText}")`).first();
if ((await link.count()) === 0) {
  console.log(JSON.stringify({ error: `no sidebar link matching "${linkText}"` }));
  await browser.close();
  process.exit(0);
}

const clickStart = Date.now();
await link.click();
let urlChangedAt = null;
try {
  await page.waitForFunction(
    (prev) => location.href !== prev,
    before,
    { timeout: budget * 1000, polling: 50 },
  );
  urlChangedAt = Date.now() - clickStart;
} catch {}

// Content ready = the main region has real content, not just the skeleton.
let contentReadyAt = null;
try {
  await page.waitForFunction(
    () => {
      const main = document.querySelector("main");
      if (!main) return false;
      const busy = main.querySelector(".animate-pulse, .animate-spin");
      return main.textContent && main.textContent.trim().length > 200 && !busy;
    },
    null,
    { timeout: budget * 1000, polling: 100 },
  );
  contentReadyAt = Date.now() - clickStart;
} catch {}

const afterClickUrl = page.url();

// Compare against a hard load of the same URL.
const hardStart = Date.now();
await page.goto(afterClickUrl, { waitUntil: "domcontentloaded", timeout: 90000 });
const hardDomReady = Date.now() - hardStart;

console.log(
  JSON.stringify(
    {
      linkText,
      from: before,
      to: afterClickUrl,
      clientNavUrlChangeMs: urlChangedAt,
      clientNavContentReadyMs: contentReadyAt,
      hardLoadDomReadyMs: hardDomReady,
    },
    null,
    2,
  ),
);

await browser.close();
