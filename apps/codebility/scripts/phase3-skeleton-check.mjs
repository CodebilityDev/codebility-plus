// Phase 3 gate: confirm each route now commits a skeleton shell immediately.
// Navigates client-side (where loading.tsx matters) and samples the DOM fast.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-phase2-profile");
const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const routes = process.argv.slice(2);
const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1440, height: 900 },
});
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));

await page.goto("http://localhost:3000/home", { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(5000);

const out = [];
for (const r of routes) {
  // Warm compile so we measure navigation, not first compile.
  await page.goto("http://localhost:3000" + r, { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(4000);
  await page.goto("http://localhost:3000/home", { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(2500);

  // Client-side navigate and sample skeletons as early as possible.
  const res = await page.evaluate(async (route) => {
    const link = document.querySelector(`a[href="${route}"]`);
    const t0 = performance.now();
    if (link) link.click();
    let skeletonSeen = 0;
    let firstSkeletonAt = null;
    for (let i = 0; i < 120; i++) {
      await new Promise((r) => requestAnimationFrame(r));
      const n = document.querySelectorAll(".animate-pulse").length;
      if (n > 0) {
        skeletonSeen = Math.max(skeletonSeen, n);
        if (firstSkeletonAt === null) firstSkeletonAt = Math.round(performance.now() - t0);
      }
      if (performance.now() - t0 > 4000) break;
    }
    return {
      hadLink: !!link,
      skeletonSeen,
      firstSkeletonAt,
      finalUrl: location.pathname,
      elapsed: Math.round(performance.now() - t0),
    };
  }, r);
  out.push({ route: r, ...res });
  await page.waitForTimeout(1500);
}

console.log(JSON.stringify({ out, errors }, null, 2));
await context.close();
