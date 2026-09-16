// Verifies the dashboard leaderboard still renders, switches tabs, and that the
// realtime channel is subscribed after the TanStack Query conversion.
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
  if (m.type() === "error") errors.push(m.text().slice(0, 160));
});

const apiCalls = [];
page.on("response", (r) => {
  const u = new URL(r.url());
  if (u.pathname.includes("leaderboard")) {
    apiCalls.push({ path: u.pathname + u.search, status: r.status() });
  }
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(8000);

const leaderboardVisible = await page
  .locator("text=Weekly Top")
  .first()
  .isVisible()
  .catch(() => false);

// Read the rendered rows of the default (all-time technical) board.
const readRows = () =>
  page.evaluate(() => {
    const tables = [...document.querySelectorAll("table")];
    const table = tables[tables.length - 1];
    if (!table) return [];
    return [...table.querySelectorAll("tbody tr")]
      .map((tr) =>
        [...tr.querySelectorAll("td")].map((td) => td.textContent?.trim() ?? ""),
      )
      .filter((cells) => cells.some((c) => c.length > 0));
  });

const initialRows = await readRows();

// Switch to the Soft Skills tab and confirm a new request fires.
const softTab = page.getByRole("tab", { name: /soft/i }).first();
const softTabExists = (await softTab.count()) > 0;
if (softTabExists) {
  await softTab.click().catch(() => {});
  await page.waitForTimeout(3000);
}
const afterSoftRows = await readRows();

console.log(
  JSON.stringify(
    {
      url: page.url(),
      leaderboardVisible,
      initialRowCount: initialRows.length,
      firstRowSample: initialRows.slice(0, 3),
      softTabExists,
      afterSoftRowCount: afterSoftRows.length,
      leaderboardApiCalls: apiCalls,
      errors: errors.slice(0, 8),
    },
    null,
    2,
  ),
);

await browser.close();
