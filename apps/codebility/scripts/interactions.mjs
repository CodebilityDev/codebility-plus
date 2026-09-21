// Focused interaction tests for the paths the refactors touched.
// Fixes two targeting bugs from the first suite run:
//  - the like button must be scoped to a question card, not the navbar bell
//  - SVG className is an SVGAnimatedString, so use getAttribute("class")
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const BASE = "http://localhost:3000";
const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-ix-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1300 },
});
const page = context.pages()[0] ?? (await context.newPage());

let errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));
const out = [];

// ---- 1. overflow like toggle ----------------------------------------------
{
  await page.goto(BASE + "/home/overflow", { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(11000);
  errors = [];

  // Scope to the question feed: the like button sits next to a comment button
  // inside an article/card, well below the navbar.
  const read = () =>
    page.evaluate(() => {
      const btns = [...document.querySelectorAll("button")].filter((b) => {
        const svg = b.querySelector("svg");
        if (!svg) return false;
        const cls = svg.getAttribute("class") || "";
        // ArrowBigUp is the like icon in QuestionCard
        return /arrow-big-up/.test(cls) && b.getBoundingClientRect().top > 250;
      });
      return btns.map((b) => ({
        count: Number(b.innerText.trim()) || 0,
        active: /orange/.test(b.getAttribute("class") || ""),
      }));
    });

  const before = await read();
  const likeBtn = page
    .locator('button:has(svg[class*="arrow-big-up"])')
    .filter({ hasNotText: /view|comment/i })
    .first();

  let on = null;
  let off = null;
  if ((await likeBtn.count()) && before.length) {
    await likeBtn.scrollIntoViewIfNeeded();
    await likeBtn.click();
    await page.waitForTimeout(3500);
    on = await read();
    await likeBtn.click();
    await page.waitForTimeout(3500);
    off = await read();
  }

  const up = before[0] && on?.[0] && on[0].count === before[0].count + 1 && on[0].active;
  const back = before[0] && off?.[0] && off[0].count === before[0].count && !off[0].active;
  out.push({
    name: "overflow like toggle (isLiked seeded from server likedPostIds)",
    before: before[0] ?? null,
    afterLike: on?.[0] ?? null,
    afterUnlike: off?.[0] ?? null,
    errors: [...errors],
    pass: !!(up && back) && errors.length === 0,
  });
}

// ---- 2. contact info save -> invalidate -> refetch -------------------------
{
  const apiCalls = [];
  const onReq = (r) => {
    if (/\/api\/profile-points\//.test(r.url())) apiCalls.push(Date.now());
  };
  page.on("request", onReq);

  await page.goto(BASE + "/home/settings/profile", { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(13000);
  errors = [];
  const onLoad = apiCalls.length;

  const clickEdit = () =>
    page.evaluate(() => {
      const phone = [...document.querySelectorAll("input")].find((i) =>
        /phone/i.test(i.id + i.placeholder),
      );
      if (!phone) return { ok: false, why: "no phone input" };
      const svgs = [...document.querySelectorAll("svg")].filter((s) =>
        (s.getAttribute("class") || "").includes("cursor-pointer"),
      );
      if (!svgs.length) return { ok: false, why: "no cursor-pointer svg" };
      const py = phone.getBoundingClientRect().top;
      let best = null;
      let bd = Infinity;
      for (const s of svgs) {
        const d = Math.abs(s.getBoundingClientRect().top - py);
        if (d < bd) {
          bd = d;
          best = s;
        }
      }
      best.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      return { ok: true, candidates: svgs.length };
    });

  const c1 = await clickEdit();
  await page.waitForTimeout(2500);

  const editState = await page.evaluate(() => {
    const phone = [...document.querySelectorAll("input")].find((i) =>
      /phone/i.test(i.id + i.placeholder),
    );
    return {
      phoneEnabled: phone ? !phone.disabled : null,
      hasSubmit: !!document.querySelector('button[type="submit"]'),
    };
  });

  let saved = null;
  let afterSave = null;
  let restored = null;
  let persistCheck = null;

  if (editState.phoneEnabled && editState.hasSubmit) {
    const field = page.locator("input#portfolio_website").first();
    const original = await field.inputValue();

    await field.click();
    await field.press("End");
    await field.pressSequentially("9", { delay: 70 });
    await page.waitForTimeout(1500);

    const dirty = await page.evaluate(
      () => !document.querySelector('button[type="submit"]')?.disabled,
    );

    if (dirty) {
      await page.locator('button[type="submit"]').first().click();
      await page.waitForTimeout(8000);
      saved = await page.evaluate(() => ({
        leftEditMode: !document.querySelector('button[type="submit"]'),
      }));
      afterSave = apiCalls.length;

      // staleTimes.dynamic=30 caches the RSC payload, so the profile route is
      // only correct on return if the mutation revalidated it.
      const written = await field.inputValue().catch(() => null);
      await page.goto(BASE + "/home", { waitUntil: "domcontentloaded", timeout: 300000 });
      await page.waitForTimeout(4000);
      await page.goto(BASE + "/home/settings/profile", {
        waitUntil: "domcontentloaded",
        timeout: 300000,
      });
      await page.waitForTimeout(9000);
      const seenOnReturn = await page
        .locator("input#portfolio_website")
        .first()
        .inputValue()
        .catch(() => null);
      persistCheck = {
        written,
        seenOnReturn,
        revalidated: written !== null && seenOnReturn === written,
      };

      // restore original value
      await clickEdit();
      await page.waitForTimeout(2500);
      const f2 = page.locator("input#portfolio_website").first();
      await f2.click();
      await f2.press("End");
      await f2.press("Backspace");
      await page.waitForTimeout(1500);
      const d2 = await page.evaluate(
        () => !document.querySelector('button[type="submit"]')?.disabled,
      );
      if (d2) {
        await page.locator('button[type="submit"]').first().click();
        await page.waitForTimeout(8000);
      }
      restored = (await f2.inputValue().catch(() => null)) === original;
    } else {
      saved = { leftEditMode: null, why: "form never became dirty" };
    }
  }

  page.off("request", onReq);
  out.push({
    name: "contact info save -> invalidate -> refetch",
    editIcon: c1,
    enteredEditMode: editState.phoneEnabled === true,
    saved,
    pointsRequestsOnLoad: onLoad,
    pointsRequestsAfterSave: afterSave,
    refetchedAfterSave: afterSave !== null && afterSave > onLoad,
    persistOnReturn: persistCheck,
    originalValueRestored: restored,
    errors: [...errors],
    pass:
      editState.phoneEnabled === true &&
      saved?.leftEditMode === true &&
      afterSave !== null &&
      afterSave > onLoad &&
      persistCheck?.revalidated === true &&
      errors.length === 0,
  });
}

console.log(JSON.stringify(out, null, 2));
await context.close();
