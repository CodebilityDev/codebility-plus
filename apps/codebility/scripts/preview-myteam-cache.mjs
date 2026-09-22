// Measures caching behaviour of /home/my-team card navigation on the preview.
//
// For each project card: visit cold, then repeatedly go back to the dashboard
// and click the card again. Each transition records wall-clock time, whether
// the RSC payload came off the network or the client Router Cache, how many
// skeleton frames painted, and how many Supabase auth vs rest round-trips
// fired. That separates "Router Cache hit" from "revalidate" from "auth cost".
//
// Run: node scripts/preview-myteam-cache.mjs
// Opts: PREVIEW_BASE, ROUNDS, PROJECT_LIMIT
import path from "node:path";
import os from "node:os";

const BASE =
  process.env.PREVIEW_BASE ??
  "https://codebility-plus-codebility-portal-aa06hbu6n-zeff01s-projects.vercel.app";
const ROUNDS = Number(process.env.ROUNDS ?? 3);
const PROJECT_LIMIT = Number(process.env.PROJECT_LIMIT ?? 3);

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-run-profile");

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1100 },
});
const page = context.pages()[0] ?? (await context.newPage());

// Track every request so latency can be attributed to RSC vs Supabase.
let netLog = [];
page.on("request", (r) => {
  const u = r.url();
  if (u.includes("_rsc=") || u.includes("supabase.co")) {
    netLog.push({ url: u, t: Date.now() });
  }
});
const errors = [];
page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 200)));

function drainNet() {
  const out = netLog.splice(0, netLog.length);
  const rsc = out.filter((r) => r.url.includes("_rsc="));
  const auth = out.filter((r) => r.url.includes("/auth/v1/"));
  const rest = out.filter((r) => r.url.includes("/rest/v1/"));
  return {
    rsc: rsc.length,
    auth: auth.length,
    rest: rest.length,
    authMs: auth
      .map((r) => r.t)
      .sort((a, b) => a - b),
  };
}

async function armSkeletonCounter() {
  await page.evaluate(() => {
    window.__pulses = 0;
    if (window.__skelRaf) cancelAnimationFrame(window.__skelRaf);
    const tick = () => {
      if (document.querySelector(".animate-pulse")) window.__pulses++;
      window.__skelRaf = requestAnimationFrame(tick);
    };
    window.__skelRaf = requestAnimationFrame(tick);
  });
}

async function probe(label, action) {
  await armSkeletonCounter().catch(() => {});
  const t0 = Date.now();
  await action();

  // Navigation is "settled" once no skeleton is on screen.
  await page
    .waitForFunction(() => !document.querySelector(".animate-pulse"), { timeout: 60000 })
    .catch(() => {});
  const ms = Date.now() - t0;

  const pulses = await page.evaluate(() => window.__pulses ?? -1).catch(() => -1);
  const url = page.url().replace(BASE, "");
  const textLen = await page.evaluate(() => document.body.innerText.length).catch(() => 0);

  return { label, url, ms, pulses, textLen, ...drainNet() };
}

// ---------- run ----------
console.log(`base: ${BASE}`);
await page.goto(`${BASE}/home/my-team`, { waitUntil: "domcontentloaded", timeout: 180000 });
await page.waitForTimeout(10000);

if (page.url().includes("sign-in")) {
  console.log(JSON.stringify({ error: "not authenticated", url: page.url() }, null, 2));
  await context.close();
  process.exit(0);
}

const cards = await page.evaluate(() =>
  [
    ...new Set(
      [...document.querySelectorAll('a[href^="/home/my-team/"]')].map((a) =>
        a.getAttribute("href"),
      ),
    ),
  ].filter(Boolean),
);

console.log(JSON.stringify({ cardsFound: cards.length, targeting: cards.slice(0, PROJECT_LIMIT) }, null, 2));

const results = [];
for (const href of cards.slice(0, PROJECT_LIMIT)) {
  // Cold: hard navigation, exercises the server path with no Router Cache.
  results.push(
    await probe(`cold ${href.slice(-8)}`, async () => {
      await page.goto(`${BASE}${href}`, { waitUntil: "domcontentloaded", timeout: 120000 });
    }),
  );
  await page.waitForTimeout(3000);

  for (let r = 2; r <= ROUNDS; r++) {
    await page.goto(`${BASE}/home/my-team`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForTimeout(4000);

    // Soft navigation via a real click: this is what a user does.
    results.push(
      await probe(`spa r${r} ${href.slice(-8)}`, async () => {
        await page.locator(`a[href="${href}"]`).first().click({ timeout: 30000 });
      }),
    );
    await page.waitForTimeout(1500);

    results.push(
      await probe(`back r${r} ${href.slice(-8)}`, async () => {
        await page.goBack({ waitUntil: "domcontentloaded", timeout: 60000 });
      }),
    );
    await page.waitForTimeout(1500);
  }
}

const byKind = (k) => results.filter((r) => r.label.startsWith(k));
const avg = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b.ms, 0) / arr.length) : 0);

console.log(
  JSON.stringify(
    {
      errors: errors.slice(0, 15),
      perNav: results,
      summary: {
        cold: { n: byKind("cold").length, avgMs: avg(byKind("cold")), avgRsc: avg(byKind("cold").map((r) => ({ ms: r.rsc }))) },
        spa: { n: byKind("spa").length, avgMs: avg(byKind("spa")), avgRsc: avg(byKind("spa").map((r) => ({ ms: r.rsc }))) },
        back: { n: byKind("back").length, avgMs: avg(byKind("back")), avgRsc: avg(byKind("back").map((r) => ({ ms: r.rsc }))) },
      },
    },
    null,
    2,
  ),
);

await context.close();
