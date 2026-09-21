// Verify the overflow like button still toggles after seeding isLiked from
// server-provided likedPostIds instead of a per-card checkPostLike call.
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
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 250)));

await page.goto("http://localhost:3000/home/overflow", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(8000);

// The like control is the button containing the ArrowBigUp svg + a number.
const readLike = async () =>
  page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")].filter((b) =>
      b.querySelector("svg.lucide-arrow-big-up, svg[class*='arrow-big-up']"),
    );
    return btns.slice(0, 3).map((b) => ({
      text: b.innerText.trim(),
      active: b.className.includes("orange"),
    }));
  });

const before = await readLike();

// Click the first like button twice (toggle on, then off).
const btn = page
  .locator("button")
  .filter({ has: page.locator("svg[class*='arrow-big-up']") })
  .first();

let afterOn = null;
let afterOff = null;
if (await btn.count()) {
  await btn.click();
  await page.waitForTimeout(3000);
  afterOn = await readLike();
  await btn.click();
  await page.waitForTimeout(3000);
  afterOff = await readLike();
}

console.log(JSON.stringify({ before, afterOn, afterOff, errors }, null, 2));
await context.close();
