// Launches Chrome on the authenticated preview profile with remote debugging
// enabled, and leaves it running. Both the user and the agent can use this one
// window: the user drives the UI, the agent attaches over CDP on port 9222 to
// read console/network logs and drive it when asked.
//
// Nothing here navigates after launch, so the user's session and tab are never
// hijacked. Close the window to end the session.
//
// Run: node scripts/preview-dev-window.mjs
import path from "node:path";
import os from "node:os";
import { spawn } from "node:child_process";

const BASE = process.env.PREVIEW_BASE ?? "http://localhost:3000";
const PORT = Number(process.env.CDP_PORT ?? 9222);

// The profile that already holds the signed-in session.
const PROFILE = path.join(os.tmpdir(), "codebility-run-profile");

const chromeCandidates = [
  path.join(process.env.PROGRAMFILES ?? "", "Google/Chrome/Application/chrome.exe"),
  path.join(process.env["PROGRAMFILES(X86)"] ?? "", "Google/Chrome/Application/chrome.exe"),
  path.join(process.env.LOCALAPPDATA ?? "", "Google/Chrome/Application/chrome.exe"),
];

let chrome = null;
for (const c of chromeCandidates) {
  if (c && (await import("node:fs")).existsSync(c)) {
    chrome = c;
    break;
  }
}

if (!chrome) {
  console.log(JSON.stringify({ error: "chrome.exe not found", tried: chromeCandidates }, null, 2));
  process.exit(1);
}

const args = [
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${PROFILE}`,
  // A distinct profile plus these flags stop Chrome from handing the launch off
  // to an already-running instance (which exits our child immediately with 0
  // and leaves no debug port behind).
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-features=Translate,OptimizationHints",
  "--disable-background-mode",
  "--new-window",
  BASE,
];

console.log(JSON.stringify({ chrome, PROFILE, PORT, BASE, args }, null, 2));

// detached + ignored stdio so the browser outlives this script's job.
const child = spawn(chrome, args, { detached: true, stdio: "ignore" });
child.unref();

// Confirm the debug port actually came up rather than trusting the spawn.
const deadline = Date.now() + 30000;
let up = false;
while (Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 1000));
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
    if (res.ok) {
      const v = await res.json();
      console.log(`CDP UP: ${v.Browser}`);
      up = true;
      break;
    }
  } catch {
    // not listening yet
  }
}

if (!up) {
  console.log(`CDP did not come up on ${PORT}. Chrome may have handed off to an existing instance.`);
  process.exit(1);
}

console.log(`Window is open on ${BASE}. Both you and the agent can use it.`);
console.log("Chrome is detached; it outlives this script. Close the window when done.");

// Keep the loop alive with a timer rather than an unsettled top-level await,
// which node treats as a fatal warning and exits on.
const keepAlive = setInterval(() => {}, 1 << 30);
const stop = () => {
  clearInterval(keepAlive);
  console.log("launcher stopped (chrome keeps running)");
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
