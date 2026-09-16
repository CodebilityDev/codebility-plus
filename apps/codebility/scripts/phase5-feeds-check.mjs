// Phase 5 Tier 1 gate: /home/feeds renders with server-provided data and no
// mount-time server-action fetches.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-phase2-profile");
const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1000 },
});
const page = context.pages()[0] ?? (await context.newPage());

const posts = [];
page.on("request", (r) => {
  if (r.method() === "POST") posts.push(r.url());
});
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 250)));

await page.goto("http://localhost:3000/home", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(4000);

const beforeNav = posts.length;
await page.goto("http://localhost:3000/home/feeds", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(6000);

const ui = await page.evaluate(() => {
  const txt = document.body.innerText;
  return {
    heading: document.querySelector("h1")?.textContent ?? null,
    hasSocialPoints: /Social Points/i.test(txt),
    pointsValue: txt.match(/Social Points[\s\S]{0,80}?(\d+)\s*points/i)?.[1] ?? null,
    createPostLabel: /Create (your first )?post/i.test(txt) ? txt.match(/Create (?:your first )?post/i)[0] : null,
    bodyLen: txt.length,
  };
});

console.log(
  JSON.stringify(
    {
      postsDuringFeedsNav: posts.slice(beforeNav),
      postCount: posts.length - beforeNav,
      ui,
      errors,
    },
    null,
    2,
  ),
);
await context.close();
