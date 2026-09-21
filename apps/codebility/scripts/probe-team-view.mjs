// Verify the my-team detail page renders after the ChecklistStatusBanner change,
// and capture the checklist banner's actual state.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2];
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

await page.goto("http://localhost:3000" + route, {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(11000);

const info = await page.evaluate(() => {
  const txt = document.body.innerText;
  return {
    heading: document.querySelector("h1")?.textContent ?? null,
    hasChecklist: /checklist/i.test(txt),
    checklistSummary: txt.match(/(\d+)\/(\d+)\s*members?\s*(complete|fully)/i)?.[0] ?? null,
    hasMembers: /members/i.test(txt),
    memberCount: txt.match(/(\d+)\s*Members/i)?.[1] ?? null,
    bodyLen: txt.length,
  };
});

await page.screenshot({ path: path.join(os.tmpdir(), "codebility-phase2-shots", "myteam.png") });
console.log(JSON.stringify({ info, errors }, null, 2));
await context.close();
