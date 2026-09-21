// Robust ContactInfo edit test: target the edit control by DOM position
// (the svg inside the Contact Info header), not by className.
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
page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));

const pointCalls = [];
page.on("request", (r) => {
  if (/\/api\/profile-points\//.test(r.url())) pointCalls.push(Date.now());
});

await page.goto("http://localhost:3000/home/settings/profile", {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(9000);
const afterLoad = pointCalls.length;

// Click the LAST svg in the Contact Info block header (the pencil), found by
// locating the "Contact Info" heading's containing box.
const clicked = await page.evaluate(() => {
  const all = [...document.querySelectorAll("div")];
  const box = all.find((d) => {
    const h = d.querySelector("h1,h2,h3,p,span");
    return h && /^\s*Contact Info\s*$/i.test(h.textContent || "");
  });
  if (!box) return "no-box";
  let root = box;
  for (let i = 0; i < 5 && root.parentElement; i++) root = root.parentElement;
  const svgs = [...root.querySelectorAll("svg")];
  if (!svgs.length) return "no-svg";
  svgs[svgs.length - 1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  return "clicked svg count=" + svgs.length;
});
await page.waitForTimeout(2500);

const state = await page.evaluate(() => {
  const phone = [...document.querySelectorAll("input")].find((x) => /phone/i.test(x.id + x.placeholder));
  const submit = [...document.querySelectorAll('button[type="submit"]')];
  return {
    phoneDisabled: phone ? phone.disabled : null,
    submitCount: submit.length,
    submitDisabled: submit[0] ? submit[0].disabled : null,
    cancelVisible: [...document.querySelectorAll("button")].some((b) => /^cancel$/i.test(b.innerText.trim())),
  };
});

let savedOk = null;
if (state.phoneDisabled === false && state.submitCount > 0) {
  const phoneLoc = page.locator('input[id*="phone" i]').first();
  if (await phoneLoc.count()) {
    await phoneLoc.click();
    await phoneLoc.press("End");
    await phoneLoc.pressSequentially("9", { delay: 50 });
    await page.waitForTimeout(1500);
    const dirty = await page.evaluate(() => {
      const b = document.querySelector('button[type="submit"]');
      return b ? !b.disabled : null;
    });
    if (dirty) {
      await page.locator('button[type="submit"]').first().click();
      await page.waitForTimeout(7000);
      savedOk = true;
      // Restore: enter edit mode again and remove the digit.
      const re = await page.evaluate(() => {
        const all = [...document.querySelectorAll("div")];
        const box = all.find((d) => {
          const h = d.querySelector("h1,h2,h3,p,span");
          return h && /^\s*Contact Info\s*$/i.test(h.textContent || "");
        });
        if (!box) return false;
        let root = box;
        for (let i = 0; i < 5 && root.parentElement; i++) root = root.parentElement;
        const svgs = [...root.querySelectorAll("svg")];
        if (!svgs.length) return false;
        svgs[svgs.length - 1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
        return true;
      });
      if (re) {
        await page.waitForTimeout(1500);
        const pl = page.locator('input[id*="phone" i]').first();
        if (await pl.count()) {
          await pl.click();
          await pl.press("End");
          await pl.press("Backspace");
          await page.waitForTimeout(1200);
          const b = page.locator('button[type="submit"]').first();
          if ((await b.count()) && (await b.isEnabled().catch(() => false))) {
            await b.click();
            await page.waitForTimeout(6000);
          }
        }
      }
    }
  }
}

const final = await page.evaluate(() => ({
  completion: document.body.innerText.match(/(\d+)%/)?.[1] ?? null,
  heading: document.querySelector("h1")?.textContent ?? null,
}));

console.log(
  JSON.stringify(
    {
      clicked,
      afterLoad,
      pointCallsTotal: pointCalls.length,
      extraCallsDuringSave: pointCalls.length - afterLoad,
      state,
      savedOk,
      final,
      errors,
    },
    null,
    2,
  ),
);
await context.close();
