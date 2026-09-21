// Isolated check for the React #418 (text hydration mismatch) reported on
// /home/tasks, on dev and preview, loading the route directly with no other
// navigation in flight.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const PREVIEW =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-22ly08bdz-zeff01s-projects.vercel.app";
const DEV = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const run = async (label, base, profileName) => {
  const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
  const PROFILE = path.join(os.tmpdir(), profileName);
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
  page.on("pageerror", (e) => errs.push("PAGEERROR " + String(e).slice(0, 260)));
  page.on("console", (m) => {
    if (m.type() === "error") errs.push("CONSOLE " + m.text().slice(0, 260));
  });

  // Warm, then hard-load /home/tasks twice: once cold-ish, once settled.
  await page.goto(base + "/home", { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(9000);

  const passes = [];
  for (let i = 0; i < 2; i++) {
    errs.length = 0;
    await page.goto(base + "/home/tasks", { waitUntil: "domcontentloaded", timeout: 300000 });
    await page.waitForTimeout(13000);
    const rows = await page.evaluate(() => document.querySelectorAll("tbody tr").length);
    const cards = await page.evaluate(() => document.querySelectorAll("article").length);
    passes.push({ pass: i + 1, rows, cards, errors: [...errs] });
  }

  await context.close();
  return { label, passes };
};

const dev = await run("dev", DEV, "codebility-p11-tasks-dev");
const preview = await run("preview", PREVIEW, "codebility-vercel-profile-t");
console.log(JSON.stringify({ dev, preview }, null, 2));
