// Row-parity capture for workstream E. Narrowing a `select` can drop a row,
// reorder results, or blank a cell, and none of those throw. This captures the
// full visible row text of page 1 and page 2 plus the reported total, to JSON,
// so a before/after diff proves nothing moved.
//
//   node scripts/p11-row-parity.mjs "/home/in-house" before.json
//   node scripts/p11-row-parity.mjs "/home/in-house" after.json
//   # diff must be empty
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2];
const outFile = process.argv[3];
if (!route || !outFile) {
  console.error("usage: node scripts/p11-row-parity.mjs <route> <out.json>");
  process.exit(1);
}

const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-parity");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

const snapshot = async () => {
  const rows = await page.evaluate(() =>
    [...document.querySelectorAll("tbody tr")].map((r) =>
      r.innerText.replace(/\s+/g, " ").trim(),
    ),
  );
  // The "N members" / "N found" style total, if the route shows one.
  const total = await page.evaluate(() => {
    const m = document.body.innerText.replace(/\s+/g, " ").match(/(\d+)\s+(members|found|total|clients|projects|tasks|applicants)/i);
    return m ? m[0] : null;
  });
  return { rows, total };
};

await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(8000);
await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(12000);

const page1 = await snapshot();

// Advance to page 2 if the pager offers it.
const nav = page.locator("nav").filter({ hasText: /Previous/ }).last();
const has2 = (await nav.locator("a", { hasText: /^2$/ }).count()) > 0;
if (has2) {
  await nav.locator("a", { hasText: /^2$/ }).first().click({ timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(7000);
}
const page2 = await snapshot();

const payload = { route, page1, page2 };
fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));
console.log(
  JSON.stringify(
    {
      route,
      out: outFile,
      page1Rows: page1.rows.length,
      page1Total: page1.total,
      page2Rows: page2.rows.length,
      page2Total: page2.total,
    },
    null,
    2,
  ),
);
await context.close();
