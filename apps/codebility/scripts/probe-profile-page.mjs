// Verify /home/settings/profile renders and its points-dependent UI works.
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
  viewport: { width: 1600, height: 1400 },
});
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 250)));
page.on("console", (m) => {
  if (m.type() === "error" && !/404|favicon/i.test(m.text())) {
    errors.push("console: " + m.text().slice(0, 200));
  }
});

await page.goto("http://localhost:3000/home/settings/profile", {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(12000);

const info = await page.evaluate(() => {
  const txt = document.body.innerText;
  return {
    heading: document.querySelector("h1")?.textContent ?? null,
    hasCompletion: /completion|complete/i.test(txt),
    percent: txt.match(/(\d+)%/)?.[1] ?? null,
    hasPoints: /points/i.test(txt),
    hasSkills: /skill|tech stack/i.test(txt),
    hasEducation: /education/i.test(txt),
    hasExperience: /experience/i.test(txt),
    hasContact: /contact|github|linkedin/i.test(txt),
    bodyLen: txt.length,
  };
});

await page.screenshot({ path: path.join(os.tmpdir(), "codebility-phase2-shots", "profile.png") });
console.log(JSON.stringify({ info, errors }, null, 2));
await context.close();
