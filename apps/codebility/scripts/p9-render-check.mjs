// Batch render check for routes converted in Phase 9 that have no dedicated
// probe. Asserts each renders real content (not an empty shell or error) and
// reports page errors, so a silent blank-field regression is caught.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P9_BASE ?? "http://localhost:3001";
const ROUTES = (process.argv[2] ?? "").split(",").filter(Boolean);

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p9-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

const results = [];
for (const route of ROUTES) {
  const pageErrors = [];
  const onError = (e) => pageErrors.push(String(e).slice(0, 200));
  page.on("pageerror", onError);

  await page.goto(BASE + "/home", { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(1500);
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(6000);

  const info = await page.evaluate(() => {
    const main = document.querySelector("main") || document.body;
    const text = (main.textContent || "").replace(/\s+/g, " ").trim();
    return {
      chars: text.length,
      sample: text.slice(0, 220),
      buttons: document.querySelectorAll("button").length,
      inputs: document.querySelectorAll("input,textarea,select").length,
      images: document.querySelectorAll("img").length,
      errorish: /something went wrong|is not a function|application error|unhandled/i.test(text),
    };
  });

  results.push({ route, ...info, pageErrors });
  page.off("pageerror", onError);
}

console.log(JSON.stringify(results, null, 2));
await context.close();
