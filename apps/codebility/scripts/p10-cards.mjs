// Reports what a route actually rendered: card counts, headings, and the first
// N text nodes. For card grids there is no tbody to count.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/projects";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p10-cards");
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
page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));

const reqs = [];
page.on("request", (r) => {
  const h = r.headers();
  if (r.method() === "POST" && h["next-action"]) reqs.push("action");
});

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(14000);

const out = await page.evaluate(() => {
  const btns = [...document.querySelectorAll("button")]
    .map((b) => (b.innerText || "").trim().slice(0, 24))
    .filter(Boolean);
  const imgs = [...document.querySelectorAll("img")].length;
  const grids = [...document.querySelectorAll(".grid")].map((g) => g.children.length);
  const main = document.querySelector("main") ?? document.body;
  return {
    buttons: btns,
    imageCount: imgs,
    gridChildCounts: grids,
    mainTextStart: main.innerText.replace(/\s+/g, " ").slice(0, 260),
  };
});

console.log(JSON.stringify({ route, actionRequests: reqs.length, ...out, pageErrors: errors }, null, 2));
await context.close();
