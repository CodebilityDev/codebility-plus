// Persistent browser log watcher for the shared debug Chrome.
//
// Design notes (learned the hard way):
//  - Exits on its own when the browser goes away, so a dead Chrome does not
//    leave an orphaned process holding a CDP connection.
//  - Writes a PID file so `preview-down.ps1` can stop it deterministically
//    instead of guessing by process name.
//  - Never blocks on an unsettled top-level await (node treats that as fatal).
//
// Usage:
//   node scripts/watch.mjs            # stream console + network + timing
//   node scripts/watch.mjs --quiet    # only errors and slow requests
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const PORT = Number(process.env.CDP_PORT ?? 9222);
const QUIET = process.argv.includes("--quiet");
const SLOW_MS = Number(process.env.SLOW_MS ?? 300);

const PIDFILE = path.join(os.tmpdir(), "codebility-watch.pid");
fs.writeFileSync(PIDFILE, String(process.pid));

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const ts = () => new Date().toISOString().slice(11, 23);
const log = (...a) => console.log(`[${ts()}]`, ...a);

async function connect(attempts = 30, delayMs = 1000) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await chromium.connectOverCDP(`http://127.0.0.1:${PORT}`);
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

const browser = await connect().catch((e) => {
  console.log(
    JSON.stringify(
      { error: "no debug Chrome", port: PORT, detail: String(e).slice(0, 160) },
      null,
      2,
    ),
  );
  fs.rmSync(PIDFILE, { force: true });
  process.exit(2);
});

console.log(JSON.stringify({ watching: true, port: PORT, quiet: QUIET }, null, 2));

// Per-request timing so a navigation's cost is attributable.
const inflight = new Map();
let timing = [];

function attach(page) {
  log("attached to page:", page.url().slice(0, 110) || "(blank)");

  page.on("console", (m) => {
    const t = m.type();
    if (t === "error" || (!QUIET && t === "warning")) {
      log(`console.${t}: ${m.text().slice(0, 260)}`);
    }
  });

  page.on("pageerror", (e) => log("PAGEERROR:", String(e).slice(0, 260)));

  page.on("request", (r) => {
    const u = r.url();
    if (u.includes("_rsc=") || u.includes("supabase.co") || u.includes("localhost:3000")) {
      inflight.set(r, { url: u, start: Date.now() });
    }
  });

  page.on("response", (r) => {
    const rec = inflight.get(r.request());
    if (!rec) return;
    inflight.delete(r.request());
    const ms = Date.now() - rec.start;
    const kind = rec.url.includes("/auth/v1/")
      ? "auth"
      : rec.url.includes("/rest/v1/")
        ? "rest"
        : rec.url.includes("_rsc=")
          ? "rsc"
          : null;
    if (!kind) return;
    timing.push({ kind, ms, status: r.status() });
    // Always surface errors; surface slow requests only when not quiet.
    if (r.status() >= 400 || (!QUIET && ms > SLOW_MS)) {
      log(`${kind} ${r.status()} ${ms}ms ${rec.url.replace(/^https?:\/\/[^/]+/, "").slice(0, 80)}`);
    }
  });

  page.on("requestfailed", (r) =>
    log(`REQFAIL ${r.url().slice(0, 90)} ${r.failure()?.errorText}`),
  );

  page.on("framenavigated", (f) => {
    if (f === page.mainFrame()) log("NAV", f.url().slice(0, 120));
  });

  page.on("close", () => log("page closed"));
}

for (const p of browser.contexts().flatMap((c) => c.pages())) attach(p);
browser.contexts().forEach((c) => c.on("page", attach));

// Aggregate every 20s. One auth call per nav is expected; two is a bug.
setInterval(() => {
  if (!timing.length) return;
  const g = (k) => timing.filter((t) => t.kind === k);
  const stat = (arr) => {
    if (!arr.length) return null;
    const s = arr.map((a) => a.ms).sort((a, b) => a - b);
    return { n: s.length, avg: Math.round(s.reduce((a, b) => a + b, 0) / s.length), max: s[s.length - 1] };
  };
  console.log(
    `[${ts()}] STATS rsc=${JSON.stringify(stat(g("rsc")))} auth=${JSON.stringify(
      stat(g("auth")),
    )} rest=${JSON.stringify(stat(g("rest")))}`,
  );
  timing = [];
}, 20000).unref?.();

// Self-terminate when the browser disconnects, so no orphan is left behind.
browser.on("disconnected", () => {
  log("browser disconnected, watcher exiting");
  fs.rmSync(PIDFILE, { force: true });
  process.exit(0);
});

// Hold the loop open with a timer, never an unsettled await.
const keepAlive = setInterval(() => {}, 1 << 30);
const stop = () => {
  clearInterval(keepAlive);
  fs.rmSync(PIDFILE, { force: true });
  log("watcher stopped");
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
