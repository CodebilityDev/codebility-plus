// Test the extracted useOutsideClick hook on the feeds filter drawer, and the
// useDeferredValue search it was introduced alongside.
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
  viewport: { width: 900, height: 1100 }, // below xl so the filter toggle shows
});
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 250)));

await page.goto("http://localhost:3000/home/feeds", {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(7000);

const drawerOpen = () =>
  page.evaluate(() => /Search & Filter/i.test(document.body.innerText) &&
    !!document.querySelector('input[placeholder="Search posts..."]'));

const before = await drawerOpen();

// Open the Filters drawer.
const filtersBtn = page.getByRole("button", { name: /filters/i }).first();
let opened = false;
if (await filtersBtn.count()) {
  await filtersBtn.click();
  await page.waitForTimeout(1200);
  opened = await drawerOpen();
}

// Click far outside the drawer -> useOutsideClick should close it.
if (opened) {
  await page.mouse.click(60, 900);
  await page.waitForTimeout(1200);
}
const afterOutsideClick = await drawerOpen();

// Search filtering via useDeferredValue: reopen the drawer, type a query, and
// confirm the grid reacts.
const search = page.locator('input[placeholder="Search posts..."]').first();
let searchResult = null;
if (await search.count()) {
  const visible = await search.isVisible().catch(() => false);
  if (!visible) {
    // Drawer was closed by the outside click (expected); reopen it.
    const fb = page.getByRole("button", { name: /filters/i }).first();
    if (await fb.count()) {
      await fb.click();
      await page.waitForTimeout(1200);
    }
  }
  try {
    await search.fill("zzzzzznomatch", { timeout: 15000 });
    await page.waitForTimeout(2600);
    searchResult = await page.evaluate(() => ({
      stillRendersPage: !!document.querySelector("h1"),
      bodyLen: document.body.innerText.length,
    }));
  } catch (e) {
    searchResult = { error: String(e).slice(0, 120) };
  }
}

console.log(
  JSON.stringify({ before, opened, afterOutsideClick, searchResult, errors }, null, 2),
);
await context.close();
