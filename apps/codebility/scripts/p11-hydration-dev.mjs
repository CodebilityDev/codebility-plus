// Reproduces workstream D in DEV so React prints the unminified hydration
// message naming the component and the differing text.
//
//   node scripts/p11-hydration-dev.mjs
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-hyd");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

const msgs = [];
page.on("console", (m) => {
  const t = m.text();
  if (/hydrat|did not match|Minified React error|server rendered|Text content/i.test(t)) {
    msgs.push({ kind: m.type(), text: t.slice(0, 900) });
  }
});
page.on("pageerror", (e) => msgs.push({ kind: "pageerror", text: String(e).slice(0, 900) }));

// Discover real project ids from the my-team list.
await page.goto(`${BASE}/home/my-team`, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(11000);
const ids = await page.evaluate(() =>
  [...document.querySelectorAll('a[href^="/home/my-team/"]')]
    .map((a) => a.getAttribute("href"))
    .filter((h) => /^\/home\/my-team\/[0-9a-f-]{36}$/.test(h)),
);

const targets = [
  ...new Set(ids),
  "/home/tasks",
].slice(0, 5);

const out = [];
for (const t of targets) {
  msgs.length = 0;
  await page.goto(BASE + t, { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(14000);
  out.push({ route: t, messages: msgs.slice(0, 5) });
}

console.log(JSON.stringify({ discovered: ids, out }, null, 2));
await context.close();
