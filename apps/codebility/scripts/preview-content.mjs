// Dumps the visible text of each route after it settles, so "empty" can be told
// apart from "errored" and from "renders cards we do not count".
//
//   node scripts/preview-content.mjs /home/orgchart /home/settings ...
import path from "node:path";
import os from "node:os";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-22ly08bdz-zeff01s-projects.vercel.app";
const routes = process.argv.slice(2);

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-vercel-profile");
const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1500, height: 1000 },
});
const page = context.pages()[0] ?? (await context.newPage());

const errs = [];
page.on("console", (m) => {
  if (m.type() === "error") errs.push(m.text().slice(0, 260));
});
page.on("pageerror", (e) => errs.push("PAGEERROR " + String(e).slice(0, 260)));

await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 180000 });
await page.waitForTimeout(9000);

const out = [];
for (const route of routes) {
  errs.length = 0;
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 180000 });
  await page.waitForTimeout(13000);
  // Strip the shell (sidebar + navbar) so we see only the route's own output.
  const text = await page.evaluate(() => {
    const main =
      document.querySelector("main") ??
      document.querySelector('[class*="max-w-screen"]') ??
      document.body;
    return main.innerText.replace(/\s+/g, " ").trim();
  });
  out.push({ route, url: page.url().replace(BASE, ""), text: text.slice(0, 300), errs: [...errs] });
}

console.log(JSON.stringify(out, null, 2));
await context.close();
