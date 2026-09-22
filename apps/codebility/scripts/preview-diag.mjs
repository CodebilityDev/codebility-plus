// Diagnostic: opens the preview sign-in page and reports why the page dies.
// Captures browser-level disconnect, crash, and navigation failures instead of
// only page errors, because a closed page throws on the next waitForTimeout.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-aa06hbu6n-zeff01s-projects.vercel.app";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-diag-profile");
fs.rmSync(PROFILE, { recursive: true, force: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1400, height: 950 },
});

context.on("close", () => console.log("EVENT context.close"));
context.on("page", (p) => console.log("EVENT new page:", p.url()));

const page = context.pages()[0] ?? (await context.newPage());
page.on("close", () => console.log("EVENT page.close"));
page.on("crash", () => console.log("EVENT page.crash"));
page.on("framenavigated", (f) => {
  if (f === page.mainFrame()) console.log("EVENT nav:", f.url().slice(0, 140));
});
page.on("pageerror", (e) => console.log("PAGEERROR:", String(e).slice(0, 200)));
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE:", m.text().slice(0, 200));
});
page.on("requestfailed", (r) =>
  console.log("REQFAIL:", r.url().slice(0, 120), r.failure()?.errorText),
);

console.log("goto...");
try {
  const resp = await page.goto(`${BASE}/auth/sign-in`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  console.log("status:", resp?.status());
} catch (e) {
  console.log("GOTO ERROR:", String(e).slice(0, 300));
}

for (let i = 0; i < 10; i++) {
  try {
    await page.waitForTimeout(2000);
    const u = page.url();
    const t = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " ").slice(0, 200));
    console.log(`t+${(i + 1) * 2}s url=${u.slice(0, 110)}`);
    console.log(`     text=${t.slice(0, 160)}`);
  } catch (e) {
    console.log(`t+${(i + 1) * 2}s THREW:`, String(e).slice(0, 200));
    break;
  }
}

console.log("pages still open:", context.pages().length);
await context.close().catch((e) => console.log("close err:", String(e).slice(0, 150)));
