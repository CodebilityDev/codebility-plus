// Opens localhost:3000 in a persistent Chrome profile and stays open until the
// window is closed, so a human can log in and use it normally.
//
// The profile persists in %TEMP%\codebility-probe-profile, so later probe runs
// reuse the same session.
import path from "node:path";
import os from "node:os";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE =
  process.env.PROFILE_DIR ?? path.join(os.tmpdir(), "codebility-probe-profile");
const url = process.argv[2] ?? "http://localhost:3000/home";

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  channel: "chrome",
  viewport: null,
  // Playwright injects --no-sandbox by default, which makes Chrome show the
  // "unsupported command-line flag" banner. Passing it explicitly as false keeps
  // the sandbox on and the banner away.
  chromiumSandbox: true,
  args: ["--start-maximized"],
});

const page = context.pages()[0] ?? (await context.newPage());

page.on("pageerror", (e) => console.log("[pageerror]", String(e).split("\n")[0]));
page.on("console", (m) => {
  if (m.type() === "error") console.log("[console.error]", m.text().slice(0, 200));
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });

console.log("");
console.log("  Chrome is open at " + page.url());
console.log("  Log in and use the app normally.");
console.log("  This process stays alive until you close the browser window.");
console.log("");

// Keep the process alive until the browser is closed by the user.
await new Promise((resolve) => {
  context.on("close", resolve);
  const check = setInterval(() => {
    if (context.pages().length === 0) {
      clearInterval(check);
      resolve();
    }
  }, 2000);
});

console.log("browser closed");
