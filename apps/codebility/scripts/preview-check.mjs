// Minimal connectivity + auth check against the preview. Reports the landing
// URL, whether a session cookie survived into the shared profile, and the
// visible text, without assuming the dashboard renders.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-aa06hbu6n-zeff01s-projects.vercel.app";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-preview-check");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1100 },
});
const page = context.pages()[0] ?? (await context.newPage());

const errors = [];
page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 300)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("CONSOLE " + m.text().slice(0, 300));
});

const cookies = await context.cookies(BASE);
const authCookies = cookies.filter((c) => c.name.includes("auth-token")).map((c) => c.name);

let resp = null;
try {
  resp = await page.goto(`${BASE}/home/my-team`, {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  });
} catch (e) {
  console.log(JSON.stringify({ stage: "goto-failed", err: String(e).slice(0, 400) }, null, 2));
  await context.close();
  process.exit(0);
}

await page.waitForTimeout(12000);

const info = await page.evaluate(() => ({
  url: location.href,
  title: document.title,
  textLen: document.body.innerText.length,
  snippet: document.body.innerText.replace(/\s+/g, " ").slice(0, 600),
  links: [...document.querySelectorAll("a")].map((a) => a.getAttribute("href")).filter(Boolean).slice(0, 40),
  pulsing: document.querySelectorAll(".animate-pulse").length,
}));

console.log(
  JSON.stringify(
    {
      status: resp?.status(),
      authCookies,
      cookieCount: cookies.length,
      ...info,
      errors: errors.slice(0, 15),
    },
    null,
    2,
  ),
);

await context.close();
