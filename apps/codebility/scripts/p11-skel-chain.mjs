// Captures, mid-flight, why the skeleton nodes measure 0x0: walks up the
// ancestor chain looking for a display:none, and reports the skeleton's own
// subtree regardless of size.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const route = process.argv[2] ?? "/home/in-house";
const BASE = process.env.P10_BASE ?? "http://localhost:3000";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
const PROFILE = path.join(os.tmpdir(), "codebility-p11-skel3");
fs.rmSync(PROFILE, { recursive: true, force: true });
fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

let armed = false;
let actionSeen = 0;
await page.route("**/*", async (r) => {
  const req = r.request();
  if (req.method() === "POST" && req.headers()["next-action"]) {
    actionSeen++;
    if (armed) await new Promise((res) => setTimeout(res, 3000));
  }
  await r.continue();
});

await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 300000 });
await page.waitForTimeout(12000);

armed = true;
await page
  .locator("button,a")
  .filter({ hasText: /^2$/ })
  .last()
  .click({ timeout: 15000 })
  .catch(() => {});
await page.waitForTimeout(700);

const mid = await page.evaluate(() => {
  const nodes = [...document.querySelectorAll(".animate-pulse")];
  const first = nodes[0];
  const chain = [];
  let e = first;
  while (e && chain.length < 12) {
    const cs = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    chain.push(
      `${e.tagName}.${(e.className || "").toString().slice(0, 55)} | display=${cs.display} vis=${cs.visibility} ${Math.round(r.width)}x${Math.round(r.height)}`,
    );
    e = e.parentElement;
  }
  return {
    pulseCount: nodes.length,
    firstNodeChain: chain,
    // Is the real table still mounted?
    realTableRows: document.querySelectorAll("tbody tr").length,
    skeletonContainerCount: [...document.querySelectorAll("div")].filter((d) =>
      d.className?.toString?.().includes("space-y-4"),
    ).length,
  };
});

console.log(JSON.stringify({ route, actionsSeen: actionSeen, mid }, null, 2));
await context.close();
