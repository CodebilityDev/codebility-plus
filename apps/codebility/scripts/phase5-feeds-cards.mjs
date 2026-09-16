// Deeper feeds check: are post cards rendered, and do upvote counts show?
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

await page.goto("http://localhost:3000/home/feeds", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(9000);

const info = await page.evaluate(() => {
  const txt = document.body.innerText;
  // Post cards live in the grid; count buttons whose text is a bare number.
  const upvoteButtons = [...document.querySelectorAll("button")].filter(
    (b) => /^\d+$/.test(b.innerText.trim()) && b.querySelector("svg"),
  );
  return {
    gridExists: !!document.querySelector(".grid.grid-cols-1"),
    upvoteButtonCount: upvoteButtons.length,
    upvoteValues: upvoteButtons.slice(0, 8).map((b) => b.innerText.trim()),
    hasSystemPost: /welcome to codebility|system/i.test(txt),
    skeletonsRemaining: document.querySelectorAll(".animate-pulse").length,
    bodyLen: txt.length,
  };
});

await page.screenshot({ path: path.join(os.tmpdir(), "codebility-phase2-shots", "feeds.png") });
console.log(JSON.stringify({ info, errors }, null, 2));
await context.close();
