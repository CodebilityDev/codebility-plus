// Checks whether the Tiptap SSR warning still appears. It is emitted to the
// browser console, so the check listens to console messages rather than looking
// at page text (the warning is not in the DOM).
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P9_BASE ?? "http://localhost:3001";
const ROUTES = (process.argv[2] ?? "/home/overflow").split(",").filter(Boolean);

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p9-tiptap-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

const out = [];
for (const route of ROUTES) {
  const messages = [];
  const onConsole = (m) => {
    const t = m.text();
    if (/SSR has been detected|immediatelyRender|hydrat/i.test(t)) {
      messages.push(`${m.type()}: ${t.slice(0, 200)}`);
    }
  };
  page.on("console", onConsole);

  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(7000);

  // Open the ask/compose modal so the editor mounts.
  const askBtn = page
    .locator("button")
    .filter({ hasText: /ask question|new question|ask/i })
    .first();
  let clicked = false;
  if (await askBtn.count()) {
    await askBtn.click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(4000);
    clicked = true;
  }

  out.push({ route, openedComposer: clicked, warnings: messages });
  page.off("console", onConsole);
}

console.log(JSON.stringify(out, null, 2));
await context.close();
