// Clicks the pager's next link/button on a card route and asserts one server
// request per page change, then that going back to a visited page costs none.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/clients";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p10-page");
fs.rmSync(PROFILE, { recursive: true, force: true });
if (fs.existsSync(SHARED)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));

const reqs = [];
page.on("request", (r) => {
  const h = r.headers();
  if (r.method() === "POST" && h["next-action"]) reqs.push("action");
  else if (r.method() === "GET" && /\/api\//.test(r.url())) reqs.push("api");
});

const sig = () =>
  page.evaluate(() => {
    const cards = [...document.querySelectorAll("article > *")].map((c) =>
      (c.innerText || "").replace(/\s+/g, " ").slice(0, 40),
    );
    return { n: cards.length, first: cards[0] ?? null, all: cards.join("|") };
  });

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(14000);

const p1 = await sig();

// The pager renders numeric page controls; click the one labelled "2".
reqs.length = 0;
const two = page.getByText("2", { exact: true }).last();
const hasTwo = (await two.count()) > 0;
if (hasTwo) {
  await two.click();
  await page.waitForTimeout(5000);
}
const reqsTo2 = reqs.length;
const p2 = await sig();

reqs.length = 0;
const one = page.getByText("1", { exact: true }).last();
if ((await one.count()) > 0) {
  await one.click();
  await page.waitForTimeout(4000);
}
const reqsBack = reqs.length;
const p1again = await sig();

console.log(
  JSON.stringify(
    {
      route,
      hasPage2Control: hasTwo,
      rowsPage1: p1.n,
      requestsToPage2: reqsTo2,
      rowsPage2: p2.n,
      page2Differs: p1.all !== p2.all,
      requestsReturningToPage1: reqsBack,
      rowsAfterReturn: p1again.n,
      pageErrors: errors,
    },
    null,
    2,
  ),
);
await context.close();
