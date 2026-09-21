// Dumps the actual pagination controls so the probe targets real DOM.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/in-house";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);
const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-pgdom-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());
await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(13000);

const dump = await page.evaluate(() => {
  const vis = (e) => {
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const inMain = (e) => {
    const r = e.getBoundingClientRect();
    return r.left > 240; // exclude the fixed sidebar
  };
  return {
    ariaCurrent: [...document.querySelectorAll("[aria-current]")].map((e) => ({
      tag: e.tagName,
      value: e.getAttribute("aria-current"),
      text: (e.textContent || "").trim().slice(0, 24),
      left: Math.round(e.getBoundingClientRect().left),
    })),
    numericButtons: [...document.querySelectorAll("button,a")]
      .filter((b) => vis(b) && inMain(b) && /^\d+$/.test((b.textContent || "").trim()))
      .map((b) => ({
        text: (b.textContent || "").trim(),
        cls: (b.getAttribute("class") || "").slice(0, 110),
        top: Math.round(b.getBoundingClientRect().top),
      })),
    navLikeButtons: [...document.querySelectorAll("button")]
      .filter((b) => vis(b) && inMain(b))
      .map((b) => ({
        text: (b.innerText || "").trim().slice(0, 20),
        aria: b.getAttribute("aria-label"),
        disabled: b.disabled,
        top: Math.round(b.getBoundingClientRect().top),
      }))
      .filter((b) => /next|prev|page|»|«|›|‹|→|←/i.test(b.text + " " + (b.aria ?? ""))),
    pageIndicatorText:
      (document.body.innerText.match(/Page\s+\d+\s+of\s+\d+/i) ?? [])[0] ??
      (document.body.innerText.match(/\d+\s*\/\s*\d+/) ?? [])[0] ??
      null,
  };
});

console.log(JSON.stringify({ route, ...dump }, null, 2));
await context.close();
