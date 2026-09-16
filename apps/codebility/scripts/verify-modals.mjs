// Verifies modals still open after the lazy-registry change: no dialog should be
// mounted at idle, and clicking a real trigger should mount exactly one.
import path from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";

const globalRoot = path.join(os.homedir(), "AppData", "Roaming", "npm", "node_modules");
const { chromium } = await import(
  pathToFileURL(path.join(globalRoot, "playwright", "index.mjs")).href
);

const PROFILE = path.join(os.tmpdir(), "codebility-probe-profile");
const route = process.argv[2] ?? "http://localhost:3000/home/kanban";

const browser = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  channel: "chrome",
  viewport: null,
});
const page = browser.pages()[0] ?? (await browser.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).split("\n")[0]));

await page.goto(route, { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForTimeout(7000);

const idle = await page.evaluate(
  () => document.querySelectorAll('[role="dialog"]').length,
);

const before = await page.evaluate(() => ({
  buttons: [...document.querySelectorAll("button")]
    .map((b) => b.textContent?.trim())
    .filter(Boolean)
    .slice(0, 40),
}));

let afterClick = null;
let clickedLabel = null;
for (const label of ["Add New Board", "Add Board", "Add Task", "Add Sprint", "Add"]) {
  const btn = page.getByRole("button", { name: label, exact: false }).first();
  if ((await btn.count()) > 0) {
    try {
      await btn.click({ timeout: 8000 });
      clickedLabel = label;
      await page.waitForTimeout(3000);
      afterClick = await page.evaluate(
        () => document.querySelectorAll('[role="dialog"]').length,
      );
      break;
    } catch {}
  }
}

console.log(
  JSON.stringify(
    {
      route,
      dialogsWhileIdle: idle,
      clickedLabel,
      dialogsAfterClick: afterClick,
      pageErrors: errors.slice(0, 6),
    },
    null,
    2,
  ),
);

await browser.close();
