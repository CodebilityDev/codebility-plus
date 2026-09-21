// Captures the server-action POSTs that fire during plain navigation and dumps
// their response bodies, so we can see WHAT is being called on a page view.
//
//   node scripts/preview-actions.mjs /home/in-house /home/interns
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

const actions = [];
page.on("request", (r) => {
  if (!r.url().startsWith(BASE)) return;
  if (!(r.method() === "POST" && r.headers()["next-action"])) return;
  actions.push({
    url: r.url().replace(BASE, ""),
    actionId: r.headers()["next-action"]?.slice(0, 12),
    postBody: (r.postData() ?? "").slice(0, 120),
    at: Date.now(),
  });
});

const responses = [];
page.on("response", async (r) => {
  if (!r.url().startsWith(BASE)) return;
  if (!(r.request().method() === "POST" && r.request().headers()["next-action"])) return;
  let body = "";
  try {
    body = (await r.text()).slice(0, 220);
  } catch {}
  responses.push({
    url: r.url().replace(BASE, ""),
    actionId: r.request().headers()["next-action"]?.slice(0, 12),
    status: r.status(),
    body,
  });
});

const settle = (ms) => page.waitForTimeout(ms);

await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 180000 });
await settle(12000);
const onHome = actions.splice(0);

const perRoute = [];
for (const route of routes) {
  const link = page.locator(`a[href="${route}"]`).first();
  if ((await link.count()) === 0) continue;
  await link.click();
  await settle(7000);
  perRoute.push({ route, actions: actions.splice(0) });
}

console.log(
  JSON.stringify(
    {
      actionsOnHomeLoad: onHome,
      perRoute,
      actionResponses: responses,
    },
    null,
    2,
  ),
);
await context.close();
