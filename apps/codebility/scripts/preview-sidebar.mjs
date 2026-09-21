// Counts the sidebar's /home links and how many of them the framework
// prefetches on a single page load.
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

const prefetched = new Set();
page.on("request", (r) => {
  const u = r.url();
  if (u.startsWith(BASE) && /_rsc=/.test(u)) prefetched.add(u.replace(BASE, "").split("?")[0]);
});

await page.goto(`${BASE}/home`, { waitUntil: "domcontentloaded", timeout: 180000 });
await page.waitForTimeout(22000);

const links = await page.evaluate(() => {
  const anchors = [...document.querySelectorAll('a[href^="/home"]')];
  const map = anchors.map((a) => ({
    href: a.getAttribute("href"),
    prefetch: a.getAttribute("prefetch"),
  }));
  return { total: map.length, unique: [...new Set(map.map((m) => m.href))], linkPrefetchAttr: map[0]?.prefetch ?? null };
});

console.log(
  JSON.stringify(
    {
      sidebarLinks: links.total,
      uniqueLinks: links.unique.length,
      prefetchAttrOnFirstLink: links.linkPrefetchAttr,
      links: links.unique,
      rscPrefetchesFired: prefetched.size,
      prefetchedRoutes: [...prefetched],
    },
    null,
    2,
  ),
);
await context.close();
