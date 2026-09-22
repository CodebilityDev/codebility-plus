// Attaches Playwright to the ALREADY RUNNING Chrome over CDP and either
// watches it or drives it, without taking ownership of the window.
//
// The window is launched separately by preview-dev-window.mjs. This script
// connects, optionally performs a scenario, and prints console + network
// evidence. Closing this script never closes the user's browser.
//
// Usage:
//   node scripts/preview-attach.mjs watch               # just stream logs
//   node scripts/preview-attach.mjs cards [rounds]      # click cards, measure
//   node scripts/preview-attach.mjs eval "<expr>"       # read page state
import path from "node:path";
import os from "node:os";

const PORT = Number(process.env.CDP_PORT ?? 9222);
const MODE = process.argv[2] ?? "watch";
const ROUNDS = Number(process.argv[3] ?? 3);

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

async function connectWithRetry(port, attempts = 40, delayMs = 1000) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

const browser = await connectWithRetry(PORT).catch((e) => {
  console.log(
    JSON.stringify(
      {
        error: "could not attach over CDP",
        port: PORT,
        detail: String(e).slice(0, 200),
        hint: "Is the debug Chrome running? Launch scripts/preview-window.cmd first.",
      },
      null,
      2,
    ),
  );
  process.exit(2);
});
const context = browser.contexts()[0];
if (!context) {
  console.log(JSON.stringify({ error: "no browser context over CDP" }, null, 2));
  process.exit(1);
}

const pages = context.pages();
const page = pages[pages.length - 1] ?? (await context.newPage());

const ts = () => new Date().toISOString().slice(11, 23);
const netLog = [];

// Full request/response timing so a navigation's cost can be attributed to the
// RSC payload vs Supabase auth vs Supabase REST, without needing the dev
// server's own stdout (which lives in the user's terminal).
const inflight = new Map();
const timing = [];

page.on("console", (m) => {
  const t = m.type();
  if (t === "error" || t === "warning") {
    console.log(`[${ts()}] console.${t}: ${m.text().slice(0, 300)}`);
  }
});
page.on("pageerror", (e) => console.log(`[${ts()}] PAGEERROR: ${String(e).slice(0, 300)}`));

page.on("request", (r) => {
  const u = r.url();
  if (u.includes("_rsc=") || u.includes("supabase.co") || u.includes("localhost:3000")) {
    netLog.push({ t: Date.now(), url: u.replace(/^https?:\/\/[^/]+/, "").slice(0, 120) });
    inflight.set(r, { url: u, start: Date.now(), method: r.method() });
  }
});

// Response timing is what separates "cache hit" from "revalidated".
page.on("response", async (r) => {
  const rec = inflight.get(r.request());
  if (!rec) return;
  inflight.delete(r.request());
  const ms = Date.now() - rec.start;
  const h = r.headers();
  const kind = rec.url.includes("/auth/v1/")
    ? "supabase-auth"
    : rec.url.includes("/rest/v1/")
      ? "supabase-rest"
      : rec.url.includes("_rsc=")
        ? "rsc"
        : null;
  if (!kind) return;
  timing.push({ kind, ms, status: r.status(), cache: h["x-vercel-cache"] ?? h["cache-control"] ?? "" });
  // Only narrate slow or interesting calls to keep the stream readable.
  if (ms > 150 || kind !== "rsc") {
    console.log(
      `[${ts()}] ${kind} ${r.status()} ${ms}ms ${rec.url.replace(/^https?:\/\/[^/]+/, "").slice(0, 90)}`,
    );
  }
});

page.on("requestfailed", (r) =>
  console.log(`[${ts()}] REQFAIL ${r.url().slice(0, 100)} ${r.failure()?.errorText}`),
);
page.on("framenavigated", (f) => {
  if (f === page.mainFrame()) console.log(`[${ts()}] NAV ${f.url().slice(0, 130)}`);
});

// Periodically print an aggregate so a long session is readable at a glance.
setInterval(() => {
  if (!timing.length) return;
  const group = (k) => timing.filter((t) => t.kind === k);
  const stat = (arr) => {
    if (!arr.length) return null;
    const mss = arr.map((a) => a.ms).sort((a, b) => a - b);
    return {
      n: arr.length,
      avg: Math.round(mss.reduce((a, b) => a + b, 0) / mss.length),
      min: mss[0],
      max: mss[mss.length - 1],
    };
  };
  console.log(
    `[${ts()}] STATS rsc=${JSON.stringify(stat(group("rsc")))} auth=${JSON.stringify(
      stat(group("supabase-auth")),
    )} rest=${JSON.stringify(stat(group("supabase-rest")))}`,
  );
  timing.length = 0;
}, 20000);

function drain() {
  const out = netLog.splice(0, netLog.length);
  return {
    rsc: out.filter((r) => r.url.includes("_rsc=")).length,
    auth: out.filter((r) => r.url.includes("/auth/v1/")).length,
    rest: out.filter((r) => r.url.includes("/rest/v1/")).length,
  };
}

console.log(JSON.stringify({ connected: true, port: PORT, mode: MODE, pageUrl: page.url() }, null, 2));

if (MODE === "watch") {
  // Keep the event loop alive with a timer. Blocking on a top-level await that
  // never settles makes node warn "unsettled top-level await" and exit, which
  // is what killed every previous watcher.
  const keepAlive = setInterval(() => {}, 1 << 30);
  console.log("Streaming console + network. Ctrl+C to detach (browser stays open).");
  const stop = () => {
    clearInterval(keepAlive);
    console.log("detached");
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}

if (MODE === "eval") {
  const expr = process.argv[3] ?? "1";
  const val = await page.evaluate(expr).catch((e) => "ERR " + String(e).slice(0, 200));
  console.log(JSON.stringify(val, null, 2));
  await browser.close();
  process.exit(0);
}

if (MODE === "cards") {
  await page.goto(page.url().replace(/\/home\/my-team.*$/, "/home/my-team"), {
    waitUntil: "domcontentloaded",
    timeout: 120000,
  }).catch(() => {});
  await page.waitForTimeout(6000);

  const cards = await page.evaluate(() =>
    [
      ...new Set(
        [...document.querySelectorAll('a[href^="/home/my-team/"]')].map((a) =>
          a.getAttribute("href"),
        ),
      ),
    ].filter(Boolean),
  );
  console.log(JSON.stringify({ cardsFound: cards.length }, null, 2));

  const results = [];
  for (const href of cards.slice(0, 3)) {
    const id = href.slice(-8);

    // Warm the dashboard, then soft-navigate by clicking the real card.
    await page.goto(page.url().replace(/\/home\/my-team.*$/, "/home/my-team"), {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    await page.waitForTimeout(3500);

    for (let r = 1; r <= ROUNDS; r++) {
      drain();
      const t0 = Date.now();
      await page.locator(`a[href="${href}"]`).first().click({ timeout: 30000 }).catch(() => {});
      await page
        .waitForFunction(() => !document.querySelector(".animate-pulse"), { timeout: 60000 })
        .catch(() => {});
      const ms = Date.now() - t0;
      const net = drain();
      results.push({ id, round: r, kind: "click-to-detail", ms, ...net, url: page.url().slice(-24) });

      const t1 = Date.now();
      await page.goBack({ waitUntil: "domcontentloaded", timeout: 60000 }).catch(() => {});
      await page.waitForTimeout(1200);
      const backMs = Date.now() - t1;
      const net2 = drain();
      results.push({ id, round: r, kind: "back-to-dashboard", ms: backMs, ...net2, url: page.url().slice(-24) });

      // Re-enter the dashboard cleanly for the next round.
      await page.goto(page.url().replace(/\/home\/my-team.*$/, "/home/my-team"), {
        waitUntil: "domcontentloaded",
        timeout: 120000,
      });
      await page.waitForTimeout(3000);
    }
  }

  console.table(
    results.map((r) => ({
      id: r.id,
      round: r.round,
      kind: r.kind,
      ms: r.ms,
      rsc: r.rsc,
      auth: r.auth,
      rest: r.rest,
    })),
  );
  console.log(JSON.stringify({ results }, null, 2));

  await browser.close();
  process.exit(0);
}
