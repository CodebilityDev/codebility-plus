// Captures console errors mentioning project members (or Bad Request) while
// visiting the routes that call the project-member queries.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P9_BASE ?? "http://localhost:3001";
const ROUTES = (
  process.argv[2] ?? "/home/my-team,/home/kanban,/home/projects"
)
  .split(",")
  .filter(Boolean);

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p9-pm-profile");
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
  const lines = [];
  const onConsole = (m) => {
    if (m.type() !== "error" && m.type() !== "warning") return;
    const t = m.text();
    if (/project member|Bad Request|400|PGRST/i.test(t)) {
      lines.push(`${m.type()}: ${t.slice(0, 300)}`);
    }
  };
  const onResponse = (r) => {
    if (r.status() === 400 || r.status() >= 500) {
      lines.push(`HTTP ${r.status()} ${r.url().slice(0, 160)}`);
    }
  };
  page.on("console", onConsole);
  page.on("response", onResponse);

  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(8000);

  out.push({ route, findings: [...new Set(lines)] });
  page.off("console", onConsole);
  page.off("response", onResponse);
}

console.log(JSON.stringify(out, null, 2));
await context.close();
