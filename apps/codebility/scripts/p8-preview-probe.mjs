import { chromium } from "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BASE =
  process.argv[2] ||
  "https://codebility-plus-codebility-portal-jjmdln62i-zeff01s-projects.vercel.app";
const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p8prev-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const ctx = await chromium.launchPersistentContext(PROFILE, {
  channel: "chrome",
  headless: false,
  chromiumSandbox: true,
  viewport: { width: 1440, height: 900 },
  args: ["--no-first-run", "--no-default-browser-check"],
});
for (const p of ctx.pages().slice(0, -1)) await p.close().catch(() => {});
const page = ctx.pages()[0] ?? (await ctx.newPage());

const rsc = [];
const actions = [];
const navs = [];
const prefetches = [];
page.on("request", (r) => {
  const h = r.headers();
  const u = new URL(r.url());
  const isPrefetch = !!h["next-router-prefetch"];
  const isRsc = h["rsc"] === "1";
  if (isRsc && !isPrefetch) rsc.push(u.pathname);
  if (isRsc && isPrefetch) prefetches.push(u.pathname);
  if (r.method() === "POST" && h["next-action"]) {
    actions.push(h["next-action"].slice(0, 8));
  }
  if (!isPrefetch) navs.push(`${r.method()} ${u.pathname}`);
});

// A loading skeleton is blocks with real dimensions; presence dots and
// decorative divs carry animate-pulse permanently.
const skeletons = async () => {
  let seen = 0;
  for (let i = 0; i < 20; i++) {
    const n = await page.evaluate(() =>
      [...document.querySelectorAll(".animate-pulse")].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.height >= 24 && r.width >= 120;
      }).length,
    );
    if (n > seen) seen = n;
    await page.waitForTimeout(25);
  }
  return seen;
};

const spinner = () =>
  page.evaluate(
    () =>
      [...document.querySelectorAll("svg")].filter((s) => {
        const c = s.getAttribute("class") || "";
        return /animate-spin/.test(c);
      }).length,
  );

const nav = async (label, href) => {
  rsc.length = 0;
  actions.length = 0;
  navs.length = 0;
  prefetches.length = 0;
  const t0 = Date.now();
  await page.locator(`a[href="${href}"]`).first().click({ timeout: 10000 });
  await page.waitForTimeout(9000);
  console.log(
    `${label.padEnd(26)} ${String(Date.now() - t0).padStart(6)}ms  navRsc=${rsc.length} [${[...new Set(navs)].join(",")}]  prefetch=${prefetches.length}  act=${actions.length}  skel=${await skeletons()}`,
  );
};

const warm = async (h) => {
  await page.goto(`${BASE}${h}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForTimeout(5000);
};

console.log("base:", BASE);
await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 120000 });
console.log("session:", page.url());

for (const h of ["/home", "/home/overflow", "/home/my-team", "/home/feeds"]) await warm(h);
await warm("/home");

console.log("\n-- in-session navigation (router cache under test)");
await nav("home -> overflow", "/home/overflow");
await nav("overflow -> my-team", "/home/my-team");
await nav("my-team -> overflow", "/home/overflow");
await nav("overflow -> my-team", "/home/my-team");
await nav("my-team -> home", "/home");
await nav("home -> overflow", "/home/overflow");

await ctx.close();
