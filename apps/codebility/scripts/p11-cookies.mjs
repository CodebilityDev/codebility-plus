// Lists the cookies present for the probe origin, so a missing app-level cookie
// (getCachedUser reads `supabase-user`) is visible instead of being inferred.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";
const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-cookies");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1280, height: 900 },
});
const page = context.pages()[0] ?? (await context.newPage());

await page.goto(BASE + "/home", { waitUntil: "domcontentloaded", timeout: 180000 });
await page.waitForTimeout(8000);

const cookies = await context.cookies(BASE);
console.log(
  JSON.stringify(
    {
      url: page.url(),
      cookieNames: cookies.map((c) => c.name).sort(),
      hasSupabaseUserCookie: cookies.some((c) => c.name === "supabase-user"),
      supabaseUserValue: (() => {
        const c = cookies.find((x) => x.name === "supabase-user");
        return c ? c.value.slice(0, 120) : null;
      })(),
    },
    null,
    2,
  ),
);

await context.close();
