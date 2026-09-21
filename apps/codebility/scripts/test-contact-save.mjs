// Precise test of the ContactInfo save path after the dedup refactor:
// edit -> change a field -> submit -> the post-save invalidate+refetch must
// produce exactly one extra profile-points GET and keep the badge correct.
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
  if (/\/api\/profile-points\//.test(r.url())) pointCalls.push(Date.now());
});

await page.goto("http://localhost:3000/home/settings/profile", {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(10000);
const afterLoad = pointCalls.length;

// The edit control is an <svg> with an onClick, inside the Contact Info header.
const clicked = await page.evaluate(() => {
  // Find the field labelled "Phone Number" and walk up to its section.
  const inputs = [...document.querySelectorAll("input")];
  const phone = inputs.find((i) => /9054936302|phone/i.test(i.id + i.placeholder));
  if (!phone) return "no-phone-input";
  let sec = phone;
  for (let i = 0; i < 12 && sec.parentElement; i++) {
    sec = sec.parentElement;
    if (/Contact Info/i.test(sec.textContent || "")) break;
  }
  const svg = sec.querySelector("svg[class*='cursor-pointer']");
  if (!svg) return "no-edit-svg";
  svg.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  return "clicked";
});
await page.waitForTimeout(2000);

// Confirm edit mode enabled the inputs.
const editMode = await page.evaluate(() => {
  const phone = [...document.querySelectorAll("input")].find((i) =>
    /9054936302|phone/i.test(i.id + i.placeholder),
  );
  return phone ? !phone.disabled : null;
});

// Submitting requires the form to be dirty, so change a field first. The value
// written is the same one already stored, so this exercises the save path
// without mutating the user's data.
let submitted = false;
let submitError = null;
if (editMode) {
  const website = page.locator('input#portfolio_website').first();
  if (await website.count()) {
    // Type with real keystrokes so react-hook-form's onChange fires.
    await website.click();
    await website.press("End");
    await website.pressSequentially("x", { delay: 60 });
    await page.waitForTimeout(1500);
    // Then remove it again so nothing is actually changed on save.
    await website.press("Backspace");
    await page.waitForTimeout(1500);
  }
  const submit = page.locator('button[type="submit"]').first();
  if (await submit.count()) {
    try {
      await submit.click({ timeout: 20000 });
      await page.waitForTimeout(7000);
      submitted = true;
    } catch (e) {
      submitError = String(e).slice(0, 150);
    }
  }
}

const afterSave = pointCalls.length;
const ui = await page.evaluate(() => ({
  heading: document.querySelector("h1")?.textContent ?? null,
  completion: document.body.innerText.match(/(\d+)%/)?.[1] ?? null,
  hasBadge: /Complete all contact info/i.test(document.body.innerText),
}));

console.log(
  JSON.stringify(
    {
      afterLoad,
      afterSave,
      extraCallsFromSave: afterSave - afterLoad,
      clickResult: clicked,
      editMode,
      submitted,
      submitError,
      ui,
      errors,
    },
    null,
    2,
  ),
);
await context.close();
