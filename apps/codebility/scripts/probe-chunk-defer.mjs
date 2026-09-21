// Measure whether the admin-dashboard chart JS is actually deferred: record the
// transfer size of JS loaded before first paint vs after the page settles.
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

const js = [];
page.on("response", async (r) => {
  if (!/\.js(\?|$)/.test(r.url())) return;
  let len = 0;
  try {
    len = Number(r.headers()["content-length"] ?? 0);
  } catch {}
  js.push({ url: r.url().split("/").pop(), len, at: Date.now() });
});

const t0 = Date.now();
await page.goto("http://localhost:3000/home/admin-dashboard", {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
const domReady = Date.now() - t0;
await page.waitForTimeout(12000);

const rechartsChunk = js.filter((j) => /^1313-/.test(j.url ?? ""));
const total = js.reduce((s, j) => s + j.len, 0);

console.log(
  JSON.stringify(
    {
      domReadyMs: domReady,
      jsFilesLoaded: js.length,
      totalJsBytes: total,
      rechartsChunkLoaded: rechartsChunk.length > 0,
      rechartsAtMs: rechartsChunk[0] ? rechartsChunk[0].at - t0 : null,
    },
    null,
    2,
  ),
);
await context.close();
