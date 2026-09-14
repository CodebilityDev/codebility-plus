// Answers "what is rendering, and why" instead of guessing.
//
// Usage:
//   node scripts/render-diagnose.mjs <url> [--seconds=10]
//
// Injects the React DevTools hook, then polls render counts in slices so a
// component that renders continuously is distinguishable from one that renders
// once. Reports the top offenders per slice and whether the count is still
// climbing when the window closes.

import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const globalRoot = path.join(os.homedir(), "AppData", "Roaming", "npm", "node_modules");
const playwrightEntry =
  process.env.PLAYWRIGHT_PATH ?? path.join(globalRoot, "playwright", "index.mjs");
const { chromium } = await import(pathToFileURL(playwrightEntry).href);

const url = process.argv[2];
if (!url) {
  console.error("usage: node scripts/render-diagnose.mjs <url> [--seconds=10]");
  process.exit(1);
}
const secs = Number(
  (process.argv.find((a) => a.startsWith("--seconds=")) ?? "--seconds=10").split("=")[1],
);

const PROFILE = process.env.PROFILE_DIR ?? path.join(os.tmpdir(), "codebility-probe-profile");

const HOOK = `
window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {
  renderers: new Map(), supportsFiber: true,
  inject(r) { const id = this.renderers.size + 1; this.renderers.set(id, r); return id; },
  onCommitFiberRoot() {}, onCommitFiberUnmount() {}, onPostCommitFiberRoot() {}, checkDCE() {},
};
(function () {
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  window.__renders = {};
  window.__commits = 0;
  window.__mounts = {};
  const prev = hook.onCommitFiberRoot;
  hook.onCommitFiberRoot = function () {
    window.__commits++;
    try {
      const walk = (f) => {
        if (!f) return;
        const n = (f.type && (f.type.displayName || f.type.name)) ||
                  (f.elementType && f.elementType.name);
        if (n) {
          window.__renders[n] = (window.__renders[n] || 0) + 1;
          // A fiber with no alternate has never been committed before => mount.
          if (!f.alternate) window.__mounts[n] = (window.__mounts[n] || 0) + 1;
        }
        walk(f.child); walk(f.sibling);
      };
      walk(arguments[1].current);
    } catch (e) {}
    return prev && prev.apply(this, arguments);
  };
})();
`;

const browser = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  channel: "chrome",
  viewport: null,
});
await browser.addInitScript(HOOK);

const page = browser.pages()[0] ?? (await browser.newPage());
const cors = [];
page.on("console", (m) => {
  if (m.type() === "error" && m.text().includes("CORS")) cors.push(Date.now());
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForTimeout(6000); // let initial hydration settle

const slices = [];
const sliceMs = 2000;
const sliceCount = Math.floor((secs * 1000) / sliceMs);

for (let i = 0; i < sliceCount; i++) {
  await page.evaluate(() => {
    window.__sliceStart = { ...window.__renders };
  });
  await page.waitForTimeout(sliceMs);
  const delta = await page.evaluate(() => {
    const out = {};
    for (const [k, v] of Object.entries(window.__renders)) {
      const prev = window.__sliceStart[k] ?? 0;
      if (v - prev > 0) out[k] = v - prev;
    }
    return { deltas: out, commits: window.__commits };
  });
  slices.push(delta);
}

const total = await page.evaluate(() => ({
  renders: { ...window.__renders },
  mounts: { ...window.__mounts },
  commits: window.__commits,
  interactions: performance.getEntriesByType("event").length,
}));

const top = (obj, n = 12) =>
  Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);

console.log(
  JSON.stringify(
    {
      finalUrl: page.url(),
      signedIn: !page.url().includes("sign-in"),
      totalCommits: total.commits,
      commitsPerSecond: Math.round((total.commits / secs) * 10) / 10,
      corsFailuresDuringWindow: cors.length,
      perSliceTopRenderers: slices.map((s, i) => ({
        slice: `${i * sliceMs}-${(i + 1) * sliceMs}ms`,
        activeComponents: Object.keys(s.deltas).length,
        top: top(s.deltas, 6),
      })),
      topRenderersOverall: top(total.renders, 15),
      mountCountsTop: top(total.mounts, 15),
    },
    null,
    2,
  ),
);

await browser.close();
