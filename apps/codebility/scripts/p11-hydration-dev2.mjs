// Finds my-team and kanban project ids from routes that do list them in dev,
// then loads /home/my-team/<id> in dev to capture unminified hydration output.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-hyd2");
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
  if (/hydrat|did not match|Minified React|server rendered|Text content|Warning:/i.test(t)) {
    msgs.push(t.slice(0, 1200));
  }
});
page.on("pageerror", (e) => msgs.push("PAGEERROR: " + String(e).slice(0, 1200)));

// Project ids are visible in /home/projects links and the kanban list.
await page.goto(`${BASE}/home/projects`, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(12000);
const projectIds = await page.evaluate(() =>
  [...document.querySelectorAll("a[href]")]
    .map((a) => a.getAttribute("href"))
    .filter((h) => h && /\/home\/projects\/[0-9a-f-]{36}/.test(h))
    .map((h) => h.match(/[0-9a-f-]{36}/)[0]),
);

await page.goto(`${BASE}/home/kanban`, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(12000);
const kanbanIds = await page.evaluate(() =>
  [...document.querySelectorAll("a[href]")]
    .map((a) => a.getAttribute("href"))
    .filter((h) => h && /^\/home\/kanban\/[0-9a-f-]{36}$/.test(h))
    .map((h) => h.match(/[0-9a-f-]{36}/)[0]),
);

const candidates = [...new Set([...projectIds, ...kanbanIds])].slice(0, 4);
const out = [];

for (const id of candidates) {
  for (const prefix of ["/home/my-team/"]) {
    const url = prefix + id;
    msgs.length = 0;
    await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 300000 });
    await page.waitForTimeout(14000);
    const text = await page.evaluate(() =>
      (document.querySelector("main") ?? document.body).innerText.replace(/\s+/g, " ").slice(0, 140),
    );
    out.push({ url, text, messages: msgs.slice(0, 4) });
  }
}

console.log(JSON.stringify({ projectIds: candidates, out }, null, 2));
await context.close();
