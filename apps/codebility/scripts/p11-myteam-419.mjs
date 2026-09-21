// Checks whether the React #419 on /home/my-team/<project> still reproduces, on
// this dev server and on the deployed preview, so we know if it is a real
// production-only issue or was fixed by later changes.
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

const IDS = ["1a053d2d-56f2-46a5-95be-906fb9388404", "e2e1a591-3032-4ece-9b81-570a358190bc"];

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
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 200)));
  page.on("console", (m) => {
    if (m.type() === "error" && /React error|hydrat/i.test(m.text())) {
      errs.push("CONSOLE: " + m.text().slice(0, 200));
    }
  });

  const results = [];
  await page.goto(base + "/home", { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(9000);

  for (const id of IDS) {
    errs.length = 0;
    const url = `/home/my-team/${id}`;
    await page.goto(base + url, { waitUntil: "domcontentloaded", timeout: 300000 });
    await page.waitForTimeout(13000);
    results.push({ url, pageErrors: [...errs] });
  }

  await context.close();
  return { label, results };
};

const dev = await run("dev", DEV, "codebility-p11-hyd-dev");
const preview = await run("preview", PREVIEW, "codebility-vercel-profile-d");

console.log(JSON.stringify({ dev, preview }, null, 2));
