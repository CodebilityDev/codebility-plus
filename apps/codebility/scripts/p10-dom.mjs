// Dumps the real interactive controls on a route so probes target actual DOM
// instead of assumed selectors.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/in-house";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p10-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());
await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(12000);

const dump = await page.evaluate(() => {
  const vis = (e) => {
    const r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  return {
    inputs: [...document.querySelectorAll("input")].map((i) => ({
      id: i.id || null,
      type: i.type,
      placeholder: i.placeholder || null,
      visible: vis(i),
    })),
    selects: [...document.querySelectorAll("select")].length,
    comboboxes: [...document.querySelectorAll('[role="combobox"]')].map((c) => ({
      text: (c.textContent || "").trim().slice(0, 30),
      visible: vis(c),
    })),
    buttons: [...document.querySelectorAll("button")]
      .filter(vis)
      .map((b) => (b.innerText || "").trim().slice(0, 26))
      .filter(Boolean)
      .slice(0, 28),
    tableRows: document.querySelectorAll("tbody tr").length,
  };
});

console.log(JSON.stringify({ route, ...dump }, null, 2));
await context.close();
