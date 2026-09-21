// Resolves real dynamic ids from the app's own links, then visits each dynamic
// route and reports content + errors. Avoids guessing UUIDs.
//
//   node scripts/preview-dynamic.mjs
import path from "node:path";
import os from "node:os";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-22ly08bdz-zeff01s-projects.vercel.app";

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
  if (m.type() === "error") errs.push(m.text().slice(0, 240));
});
page.on("pageerror", (e) => errs.push("PAGEERROR " + String(e).slice(0, 240)));

// Discover real ids from pages that link to the dynamic routes.
const discover = async (page_, route) => {
  await page_.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 180000 });
  await page_.waitForTimeout(11000);
  return page_.evaluate(() => {
    const hrefs = [...document.querySelectorAll("a[href]")].map((a) =>
      a.getAttribute("href"),
    );
    return {
      kanban: hrefs.filter((h) => /^\/home\/kanban\/[0-9a-f-]{36}/.test(h)).slice(0, 2),
      myTeam: hrefs.filter((h) => /^\/home\/my-team\/[0-9a-f-]{36}/.test(h)).slice(0, 2),
      hireApp: hrefs.filter((h) => /^\/home\/hire\/applications\//.test(h)).slice(0, 1),
      modal: hrefs.filter((h) => /^\/home\/promote-modal\//.test(h)).slice(0, 1),
      survey: hrefs.filter((h) => /^\/home\/settings\/surveys\/[0-9a-f-]{36}/.test(h)).slice(0, 1),
    };
  });
};

await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 180000 });
await page.waitForTimeout(9000);

const fromKanban = await discover(page, "/home/kanban");
const fromMyTeam = await discover(page, "/home/my-team");
const fromHire = await discover(page, "/home/hire");
const fromModal = await discover(page, "/home/promote-modal");
const fromSurveys = await discover(page, "/home/settings/surveys");

const targets = [
  ...fromKanban.kanban,
  ...fromKanban.kanban.slice(0, 1).map((h) => h + "/board-placeholder"),
  ...fromMyTeam.myTeam,
  ...fromHire.hireApp,
  ...fromModal.modal,
  ...fromSurveys.survey,
].filter(Boolean);

const results = [];
for (const target of [...new Set(targets)]) {
  errs.length = 0;
  try {
    await page.goto(BASE + target, { waitUntil: "domcontentloaded", timeout: 180000 });
  } catch (e) {
    results.push({ route: target, navError: String(e).slice(0, 120) });
    continue;
  }
  await page.waitForTimeout(12000);
  const text = await page.evaluate(() => {
    const main = document.querySelector("main") ?? document.body;
    return main.innerText.replace(/\s+/g, " ").trim().slice(0, 220);
  });
  results.push({ route: target, url: page.url().replace(BASE, ""), text, errs: [...errs] });
}

console.log(
  JSON.stringify({ discovered: { fromKanban, fromMyTeam, fromHire, fromModal, fromSurveys }, results }, null, 2),
);
await context.close();
