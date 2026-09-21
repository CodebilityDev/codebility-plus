// Disambiguates a filter failure: records the combobox's displayed value before
// and after the click, and the POST body of every server action, so an unrelated
// action (notification polling) cannot be mistaken for the list refetch.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/in-house";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-payload-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

const posts = [];
page.on("request", (r) => {
  if (r.method() !== "POST") return;
  const action = r.headers()["next-action"];
  if (!action) return;
  let body = null;
  try {
    body = (r.postData() ?? "").slice(0, 600);
  } catch {}
  posts.push({ action: action.slice(0, 8), body });
});

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(13000);

const comboValue = () =>
  page.evaluate(() => {
    const c = [...document.querySelectorAll('[role="combobox"]')].find((e) => {
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    return c ? (c.textContent || "").trim().slice(0, 40) : null;
  });

const firstRow = () =>
  page.evaluate(
    () =>
      document.querySelector("tbody tr")?.innerText.replace(/\s+/g, " ").slice(0, 40) ?? null,
  );

const valueBefore = await comboValue();
const rowBefore = await firstRow();
posts.length = 0;

const combo = page.locator('[role="combobox"]:visible').first();
let picked = null;
await combo.click();
await page.waitForTimeout(1200);
const opts = page.locator('[role="option"]:visible');
const optTexts = [];
const n = await opts.count();
for (let i = 0; i < Math.min(n, 8); i++) {
  optTexts.push(((await opts.nth(i).innerText().catch(() => "")) || "").trim().slice(0, 24));
}
if (n > 1) {
  picked = optTexts[1] ?? null;
  await opts.nth(1).click();
  await page.waitForTimeout(6000);
}

const valueAfter = await comboValue();
const rowAfter = await firstRow();

console.log(
  JSON.stringify(
    {
      route,
      optionsOffered: optTexts,
      picked,
      comboValueBefore: valueBefore,
      comboValueAfter: valueAfter,
      controlCommitted: valueBefore !== valueAfter,
      firstRowBefore: rowBefore,
      firstRowAfter: rowAfter,
      rowChanged: rowBefore !== rowAfter,
      postsAfterPick: posts,
      distinctActions: [...new Set(posts.map((p) => p.action))],
      verdict:
        valueBefore === valueAfter
          ? "control never committed - the Select did not take the value"
          : posts.length === 0
            ? "control committed but NO action fired"
            : rowBefore !== rowAfter
              ? "PASS"
              : "control committed, action fired, rows unchanged - inspect payload",
    },
    null,
    2,
  ),
);
await context.close();
