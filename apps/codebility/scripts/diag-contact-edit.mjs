// Diagnose whether ContactInfo's inputs actually become editable after the
// edit icon is clicked (guards against the dedup refactor breaking edit mode).
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

await page.goto("http://localhost:3000/home/settings/profile", {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(9000);

const snap = () =>
  page.evaluate(() => ({
    website: (() => {
      const i = document.querySelector("input#portfolio_website");
      return i ? { disabled: i.disabled, value: i.value } : null;
    })(),
    phone: (() => {
      const i = [...document.querySelectorAll("input")].find((x) => /phone/i.test(x.id + x.placeholder));
      return i ? { disabled: i.disabled, value: i.value } : null;
    })(),
    submitButtons: [...document.querySelectorAll('button[type="submit"]')].map((b) => ({
      text: b.innerText.trim(),
      disabled: b.disabled,
    })),
    cancelVisible: [...document.querySelectorAll("button")].some((b) => /^cancel$/i.test(b.innerText.trim())),
  }));

const before = await snap();

// Click the edit svg.
const res = await page.evaluate(() => {
  const svgs = [...document.querySelectorAll("svg")].filter((s) =>
    s.className && String(s.className).includes("cursor-pointer"),
  );
  if (!svgs.length) return "none";
  svgs[svgs.length - 1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  return "clicked-" + svgs.length;
});
await page.waitForTimeout(2500);
const after = await snap();

// Now type into the phone input if enabled.
let typed = null;
if (after.phone && !after.phone.disabled) {
  const inp = page.locator(`input`).filter({ hasNot: page.locator("[type=hidden]") });
  const phoneLoc = page.locator('input[id*="phone" i], input[placeholder*="9054"]').first();
  if (await phoneLoc.count()) {
    await phoneLoc.click();
    await phoneLoc.press("End");
    await phoneLoc.pressSequentially("9", { delay: 50 });
    await page.waitForTimeout(1200);
    typed = await page.evaluate(() => {
      const i = [...document.querySelectorAll("input")].find((x) => /phone/i.test(x.id + x.placeholder));
      return i ? i.value : null;
    });
  }
}
const final = await snap();

console.log(JSON.stringify({ res, before, after, typed, final }, null, 2));
await context.close();
