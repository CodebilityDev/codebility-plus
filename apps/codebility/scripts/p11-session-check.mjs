// Checks whether the shared probe profile still holds a valid Supabase session.
// Prints the final URL and whether the dashboard chrome rendered.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";
const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-sessioncheck");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1280, height: 900 },
});
const page = context.pages()[0] ?? (await context.newPage());

await page.goto(BASE + "/home", { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(8000);

console.log(
  JSON.stringify(
    {
      url: page.url(),
      title: await page.title(),
      signedIn: !page.url().includes("sign-in"),
      bodyHead: (await page.evaluate(() => document.body.innerText))
        .replace(/\s+/g, " ")
        .slice(0, 300),
    },
    null,
    2,
  ),
);

await context.close();
