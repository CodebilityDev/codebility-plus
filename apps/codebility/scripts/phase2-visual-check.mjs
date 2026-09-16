// Phase 2 gate: confirm removing MUI's CssBaseline did not shift layout.
// Runs routes sequentially, one browser lifetime, resilient to slow compiles.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

// Dedicated profile seeded from the logged-in probe profile, so this script
// never contends for %TEMP%\codebility-probe-profile with the other probes.
const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-phase2-profile");
if (!fs.existsSync(PROFILE)) {
  fs.cpSync(SHARED, PROFILE, { recursive: true });
}
const OUT = path.join(os.tmpdir(), "codebility-phase2-shots");
fs.mkdirSync(OUT, { recursive: true });

const routes = ["/home", "/home/projects", "/home/settings/profile", "/home/interns", "/home/kanban"];
const widths = [1440, 390];

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1440, height: 900 },
});
const page = context.pages()[0] ?? (await context.newPage());

const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 300)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("console: " + m.text().slice(0, 300));
});

const resetProbe = async () =>
  page.evaluate(() => {
    const b = getComputedStyle(document.body);
    const h = getComputedStyle(document.documentElement);
    const nav = document.querySelector("nav, aside, [class*='sidebar']");
    return {
      bodyMargin: b.margin,
      bodyPadding: b.padding,
      bodyFont: b.fontFamily,
      boxSizing: b.boxSizing,
      htmlLineHeight: h.lineHeight,
      navBox: nav ? { w: Math.round(nav.getBoundingClientRect().width), h: Math.round(nav.getBoundingClientRect().height) } : null,
      docHeight: document.documentElement.scrollHeight,
      h1: (() => {
        const el = document.querySelector("h1");
        if (!el) return null;
        const s = getComputedStyle(el);
        return { fontSize: s.fontSize, fontWeight: s.fontWeight, margin: s.margin };
      })(),
    };
  });

const out = {};

for (const w of widths) {
  for (const r of routes) {
    const key = `${r.replace(/\//g, "_")}_${w}`;
    try {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto("http://localhost:3000" + r, {
        waitUntil: "domcontentloaded",
        timeout: 300000,
      });
      await page.waitForTimeout(6000);
      const reset = await resetProbe();
      await page.screenshot({ path: path.join(OUT, key + ".png") });
      out[key] = { ok: true, reset, url: page.url() };
    } catch (e) {
      out[key] = { ok: false, error: String(e).slice(0, 200) };
    }
  }
}

out.__errors = errors;
out.__dir = OUT;
console.log(JSON.stringify(out, null, 2));
await context.close();
