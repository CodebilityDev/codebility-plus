// Measures render behavior of an authenticated page under a real interaction.
//
// Usage:
//   node scripts/render-probe.mjs <url> [--seconds=8] [--click=<selector>]
//
// Uses Playwright to open a persistent Chrome profile, injects the React
// DevTools hook before app code runs, and counts renders per component via
// onCommitFiberRoot. With --click it dispatches one real click and reports
// which components rendered because of it.
//
// The first run opens a browser you log into once; the profile persists in
// %TEMP%\codebility-probe-profile, so later runs are already signed in.

import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

// Playwright is installed globally, not in this repo, so resolve it by absolute
// path rather than bare specifier. PLAYWRIGHT_PATH overrides.
const globalRoot = path.join(os.homedir(), "AppData", "Roaming", "npm", "node_modules");
const playwrightEntry =
  process.env.PLAYWRIGHT_PATH ?? path.join(globalRoot, "playwright", "index.mjs");

const { chromium } = await import(pathToFileURL(playwrightEntry).href);

const url = process.argv[2];
if (!url) {
  console.error("usage: node scripts/render-probe.mjs <url> [--seconds=8] [--click=<selector>]");
  process.exit(1);
}
const secs = Number(
  (process.argv.find((a) => a.startsWith("--seconds=")) ?? "--seconds=8").split("=")[1],
);
const clickSel = (process.argv.find((a) => a.startsWith("--click=")) ?? "").split("=")[1];
const login = process.argv.includes("--login");

const PROFILE =
  process.env.PROFILE_DIR ?? path.join(os.tmpdir(), "codebility-probe-profile");
fs.mkdirSync(PROFILE, { recursive: true });

// A running Chrome holds a lock on its own profile, so copy just the cookies
// and local storage into a scratch profile. Override with PROFILE_DIR to use a
// Injected before any app bundle: React registers with this hook on mount.
const HOOK = `
window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {
  renderers: new Map(), supportsFiber: true,
  inject(r) { const id = this.renderers.size + 1; this.renderers.set(id, r); return id; },
  onCommitFiberRoot() {}, onCommitFiberUnmount() {}, onPostCommitFiberRoot() {}, checkDCE() {},
};
(function () {
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  window.__renders = {};
  const prev = hook.onCommitFiberRoot;
  hook.onCommitFiberRoot = function () {
    try {
      const walk = (f) => {
        if (!f) return;
        const n = (f.type && (f.type.displayName || f.type.name)) ||
                  (f.elementType && f.elementType.name);
        if (n) window.__renders[n] = (window.__renders[n] || 0) + 1;
        walk(f.child); walk(f.sibling);
      };
      walk(arguments[1].current);
    } catch (e) {}
    return prev && prev.apply(this, arguments);
  };
  window.__resetRenders = () => { window.__renders = {}; };
})();
`;

const browser = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  args: ["--profile-directory=Default"],
  viewport: null,
});
await browser.addInitScript(HOOK);

const page = browser.pages()[0] ?? (await browser.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).split("\n")[0]));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text().slice(0, 200));
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });

// On --login, hold the browser open until you are actually signed in. No time
// limit: take as long as you need. Detection is URL-based, so it also works if
// you land on any page other than sign-in.
if (login) {
  console.log("");
  console.log("  Chrome is open. Log in there (or sign up), then leave it on any");
  console.log("  signed-in page. This process waits indefinitely and continues");
  console.log("  on its own once you are through. Ctrl+C to abort.");
  console.log("");

  for (;;) {
    await page.waitForTimeout(2000);
    const current = page.url();
    const signedIn = !current.includes("sign-in") && !current.includes("sign-up");
    const onApp = current.includes("localhost:3000") && signedIn;
    if (onApp) {
      console.log(`signed in at ${current}`);
      break;
    }
    // Re-print occasionally so it is obvious the process is still alive.
    if (Date.now() % 10000 < 2000) console.log(`  still waiting (at ${current})...`);
  }

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
}

await page.waitForTimeout(secs * 1000);

const before = await page.evaluate(() => ({ ...(window.__renders ?? {}) }));
const landedOn = page.url();

let after = null;
let clicked = false;
if (clickSel) {
  await page.evaluate(() => window.__resetRenders?.());
  try {
    await page.click(clickSel, { timeout: 15000 });
    clicked = true;
  } catch (e) {
    errors.push(`click failed: ${e.message.split("\n")[0]}`);
  }
  await page.waitForTimeout(2500);
  after = await page.evaluate(() => ({ ...(window.__renders ?? {}) }));
}

const top = (obj, n = 25) =>
  Object.entries(obj ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);

console.log(
  JSON.stringify(
    {
      finalUrl: page.url(),
      signedIn: !page.url().includes("sign-in"),
      clickSelector: clickSel ?? null,
      clicked,
      renderCountsTopOnLoad: top(before),
      rendersCausedByClick: after ? top(after, 40) : null,
      distinctComponentsAfterClick: after ? Object.keys(after).length : null,
      errors: errors.slice(0, 15),
    },
    null,
    2,
  ),
);

await browser.close();
