// Drives one route with a full navigation trace: every document request, every
// redirect hop, and the final URL. Use this to answer "why did /home/tasks end
// up on /home/applicants".
//
//   node scripts/preview-trace.mjs /home/tasks
import path from "node:path";
import os from "node:os";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-22ly08bdz-zeff01s-projects.vercel.app";
const route = process.argv[2] ?? "/home/tasks";

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

const trace = [];
page.on("request", (r) => {
  if (!r.url().startsWith(BASE)) return;
  if (/_next\/static|\.(png|jpg|svg|webp|ico|woff2?)($|\?)/i.test(r.url())) return;
  const isAction = r.method() === "POST" && r.headers()["next-action"];
  trace.push({
    t: Date.now(),
    kind: isAction ? "ACTION" : "GET",
    url: r.url().replace(BASE, ""),
    redirectedFrom: r.redirectedFrom()?.url().replace(BASE, ""),
    resourceType: r.resourceType(),
  });
});

const responses = [];
page.on("response", (r) => {
  if (!r.url().startsWith(BASE)) return;
  if (r.status() >= 300 && r.status() < 400) {
    responses.push({
      status: r.status(),
      url: r.url().replace(BASE, ""),
      location: r.headers()["location"]?.replace(BASE, ""),
    });
  }
});

await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 180000 });
await page.waitForTimeout(8000);

const start = Date.now();
await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 180000 });
await page.waitForTimeout(12000);

const docs = trace.filter((e) => e.resourceType === "document" && !/\.webmanifest/.test(e.url));

console.log(
  JSON.stringify(
    {
      route,
      finalUrl: page.url().replace(BASE, ""),
      documentRequests: docs.map((d) => ({
        url: d.url,
        at: `${((d.t - start) / 1000).toFixed(1)}s`,
        redirectedFrom: d.redirectedFrom,
      })),
      redirectResponses: responses,
      pageText: await page.evaluate(() =>
        document.body.innerText.replace(/\s+/g, " ").slice(0, 260),
      ),
    },
    null,
    2,
  ),
);
await context.close();
