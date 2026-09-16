// Post-change verification for /home: server-action count, dashboard cards,
// leaderboard rows, sidebar, and console errors.
import path from "node:path";
import os from "node:os";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-probe-profile");
const url = process.argv[2] ?? "http://localhost:3000/home";

const browser = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  channel: "chrome",
  viewport: null,
});
const page = browser.pages()[0] ?? (await browser.newPage());

const errors = [];
page.on("pageerror", (e) => errors.push(String(e).split("\n")[0]));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text().slice(0, 140));
});

const posts = [];
page.on("request", (r) => {
  if (r.method() === "POST") {
    posts.push((r.headers()["next-action"] || "?").slice(0, 10));
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(9000);

const ui = await page.evaluate(() => {
  const tables = [...document.querySelectorAll("table")];
  const last = tables[tables.length - 1];
  const aside = document.querySelector("aside");
  return {
    welcome: document.body.innerText.includes("Welcome Home"),
    currentProjects: document.body.innerText.includes("Current Projects"),
    tabCount: document.querySelectorAll('[role="tab"]').length,
    leaderboardRows: last
      ? [...last.querySelectorAll("tbody tr")].filter((r) => r.textContent.trim()).length
      : 0,
    sidebarLinks: aside ? aside.querySelectorAll("a").length : 0,
    notificationBell: Boolean(document.querySelector('[aria-label^="Notifications"]')),
    announcementBell: Boolean(document.querySelector('[aria-label^="Announcements"]')),
  };
});

console.log(
  JSON.stringify(
    { url, serverActionPosts: posts, postCount: posts.length, ui, errors: errors.slice(0, 6) },
    null,
    2,
  ),
);

await browser.close();
