// Diagnostic: what does /home/in-house (and friends) actually render when signed
// in? Reports row count, pager presence, and the first visible row text, so a
// "verdict []" that passed by absence of data is distinguishable from a real pass.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const BASE = process.env.P10_BASE ?? "http://localhost:3000";
const ROUTES = process.argv.slice(2);
if (ROUTES.length === 0) {
  console.error("usage: node scripts/p11-render-diag.mjs <route> [...]");
  process.exit(1);
}

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-renderdiag");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

const out = [];
for (const route of ROUTES) {
  const errs = [];
  const onErr = (e) => errs.push(String(e));
  page.on("pageerror", onErr);

  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 180000 });
  await page.waitForTimeout(14000);

  const info = await page.evaluate(() => {
    const txt = (el) => (el ? el.innerText.replace(/\s+/g, " ").trim() : null);
    const rows = document.querySelectorAll("tbody tr");
    // Pager buttons commonly render as buttons with a numeric label.
    const numeric = [...document.querySelectorAll("button")].filter((b) =>
      /^\d+$/.test(b.innerText.trim()),
    );
    const active = [...document.querySelectorAll("button")].find(
      (b) =>
        /^\d+$/.test(b.innerText.trim()) &&
        (b.getAttribute("aria-current") === "page" ||
          /active|bg-primary|bg-\[/.test(b.className)),
    );
    return {
      finalUrl: location.pathname,
      rowCount: rows.length,
      firstRowText: txt(rows[0]),
      pagerNumbers: numeric.map((b) => b.innerText.trim()),
      activePage: active ? active.innerText.trim() : null,
      bodyHead: document.body.innerText.replace(/\s+/g, " ").slice(0, 200),
    };
  });

  page.off("pageerror", onErr);
  out.push({ route, ...info, pageErrors: errs });
}

console.log(JSON.stringify(out, null, 2));
await context.close();
