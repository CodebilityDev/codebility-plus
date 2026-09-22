// Confirms the cloned preview session authenticates, then reports the project
// cards on /home/my-team so the timing probe can target real hrefs.
import path from "node:path";
import os from "node:os";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-aa06hbu6n-zeff01s-projects.vercel.app";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-run-profile");

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1100 },
});
const page = context.pages()[0] ?? (await context.newPage());

const errors = [];
page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 200)));

const cookies = await context.cookies(BASE);
const authCookies = cookies.filter((c) => c.name.includes("auth-token")).map((c) => c.name);

await page.goto(`${BASE}/home/my-team`, {
  waitUntil: "domcontentloaded",
  timeout: 120000,
});
await page.waitForTimeout(14000);

const info = await page.evaluate(() => ({
  url: location.href,
  textLen: document.body.innerText.length,
  snippet: document.body.innerText.replace(/\s+/g, " ").slice(0, 500),
  cardHrefs: [
    ...new Set(
      [...document.querySelectorAll('a[href^="/home/my-team/"]')].map((a) =>
        a.getAttribute("href"),
      ),
    ),
  ],
  skeletons: document.querySelectorAll(".animate-pulse").length,
}));

console.log(
  JSON.stringify(
    { authCookieNames: authCookies, cookieCount: cookies.length, ...info, errors: errors.slice(0, 10) },
    null,
    2,
  ),
);

await context.close();
