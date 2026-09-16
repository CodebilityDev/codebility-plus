// Confirms the sidebar and mobile nav still render their links after
// sidebarData moved from a client fetch to a server prop.
import path from "node:path";
import os from "node:os";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-probe-profile");
const route = process.argv[2] ?? "http://localhost:3000/home";

const browser = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: null,
});
const page = browser.pages()[0] ?? (await browser.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).split("\n")[0]));

await page.goto(route, { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForTimeout(8000);

const result = await page.evaluate(() => {
  const aside = document.querySelector('aside[aria-label="Main navigation sidebar"]');
  const nav = document.querySelector('nav[aria-label="Main navigation"]');
  return {
    sidebarRendered: Boolean(aside),
    sidebarLinks: aside ? aside.querySelectorAll("a").length : 0,
    navRendered: Boolean(nav),
    navLinks: nav ? nav.querySelectorAll("a").length : 0,
    hamburger: Boolean(document.querySelector('[aria-label="Open navigation menu"]')),
  };
});

console.log(JSON.stringify({ route, ...result, errors: errors.slice(0, 5) }, null, 2));
await browser.close();
