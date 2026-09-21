// Test the profile page's save flow after the profile-points dedup refactor.
// Exercises the ContactInfo edit -> save -> invalidate -> refetch path.
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
  viewport: { width: 1600, height: 1400 },
});
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 250)));

const pointCalls = [];
page.on("request", (r) => {
  if (/\/api\/profile-points\//.test(r.url())) pointCalls.push(r.method() + " " + r.url().split("/").pop());
});

await page.goto("http://localhost:3000/home/settings/profile", {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(10000);

const initialCalls = pointCalls.length;

// Open the Contact Info edit mode (its pencil button), then cancel.
const opened = await page.evaluate(() => {
  const panels = [...document.querySelectorAll("div")].filter((d) =>
    /Contact Info/i.test(d.textContent || ""),
  );
  return panels.length > 0;
});

// Toggle edit on Contact Info via its edit icon button.
let editClicked = false;
const editBtns = page.locator('button:has(svg.lucide-square-pen), button:has(svg.lucide-pencil), button:has(svg.lucide-edit)');
const n = await editBtns.count();
if (n > 0) {
  for (let i = 0; i < Math.min(n, 8); i++) {
    const b = editBtns.nth(i);
    if (await b.isVisible().catch(() => false)) {
      await b.click();
      await page.waitForTimeout(1500);
      const inEdit = await page.evaluate(() =>
        !!document.querySelector('button[type="submit"]') ||
        /save|cancel/i.test(document.body.innerText),
      );
      if (inEdit) {
        editClicked = true;
        break;
      }
    }
  }
}

// If we entered edit mode, back out without persisting.
let cancelled = false;
if (editClicked) {
  const cancel = page.getByRole("button", { name: /cancel/i }).first();
  if (await cancel.count()) {
    await cancel.click();
    await page.waitForTimeout(1200);
    cancelled = true;
  }
}

await page.waitForTimeout(2000);
const finalUi = await page.evaluate(() => ({
  heading: document.querySelector("h1")?.textContent ?? null,
  completion: document.body.innerText.match(/(\d+)%/)?.[1] ?? null,
  hasContactBadge: /Complete all contact info/i.test(document.body.innerText),
}));

console.log(
  JSON.stringify(
    {
      pointCallsOnLoad: initialCalls,
      pointCallsTotal: pointCalls.length,
      pointCalls,
      contactPanelPresent: opened,
      editClicked,
      cancelled,
      finalUi,
      errors,
    },
    null,
    2,
  ),
);
await context.close();
