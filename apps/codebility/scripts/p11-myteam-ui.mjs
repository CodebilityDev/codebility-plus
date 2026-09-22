// Verifies the my-team interactive surface still works after deferring the
// browser Supabase client out of render: the page must render members, and
// opening the checklist/rating UI must not throw. Guards against a fix that
// removed the SSR crash by breaking the client features it was serving.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";
const PROJECT = process.env.PROJECT_ID ?? "e2e1a591-3032-4ece-9b81-570a358190bc";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-myteamui");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

const errs = [];
page.on("pageerror", (e) => errs.push("PAGEERROR " + String(e).slice(0, 240)));
page.on("console", (m) => {
  if (m.type() === "error") errs.push("CONSOLE " + m.text().slice(0, 240));
});

await page.goto(`${BASE}/home/my-team/${PROJECT}`, {
  waitUntil: "domcontentloaded",
  timeout: 180000,
});
await page.waitForTimeout(15000);

const before = await page.evaluate(() => ({
  text: document.body.innerText.length,
  members: document.querySelectorAll("tbody tr").length,
  tabs: [...document.querySelectorAll("button")]
    .map((b) => b.innerText.trim())
    .filter((t) => /members|checklist|attendance|schedule|kanban/i.test(t)),
}));

// Exercise the tabs that mount the checklist/rating clients.
const clicked = [];
for (const label of ["Checklist", "Members", "Attendance"]) {
  const btn = page.getByRole("button", { name: label, exact: true }).first();
  if ((await btn.count()) === 0) continue;
  try {
    await btn.click({ timeout: 15000 });
    await page.waitForTimeout(6000);
    clicked.push(label);
  } catch {
    /* tab not present on this project */
  }
}

const after = await page.evaluate(() => ({
  text: document.body.innerText.length,
  dialogs: document.querySelectorAll('[role="dialog"]').length,
}));

console.log(
  JSON.stringify(
    {
      url: page.url(),
      before,
      clickedTabs: clicked,
      after,
      exercised: !page.url().includes("sign-in") && before.text > 500,
      errors: errs,
    },
    null,
    2,
  ),
);

await context.close();
