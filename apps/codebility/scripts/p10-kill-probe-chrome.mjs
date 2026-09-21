// Kills only Playwright instances that this repo's probes launched, matched by
// their codebility-*-profile user-data-dir argument. Never touches the user's
// own Chrome windows.
//
//   node scripts/p10-kill-probe-chrome.mjs
import { execFileSync } from "node:child_process";

const ps = `
Get-CimInstance Win32_Process -Filter "Name like '%chrome%'" |
  Where-Object { $_.CommandLine -match 'codebility-[^\\\\"]*profile' } |
  ForEach-Object { $_.ProcessId }
`;

let out = "";
try {
  out = execFileSync("powershell", ["-NoProfile", "-Command", ps], {
    encoding: "utf8",
  });
} catch (error) {
  console.error("Could not enumerate processes:", error.message);
  process.exit(1);
}

const pids = out
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter((s) => /^\d+$/.test(s));

if (pids.length === 0) {
  console.log(JSON.stringify({ killed: 0, message: "no probe browsers running" }));
  process.exit(0);
}

for (const pid of pids) {
  try {
    execFileSync("powershell", ["-NoProfile", "-Command", `Stop-Process -Id ${pid} -Force`], {
      stdio: "ignore",
    });
  } catch {
    // Already gone.
  }
}

console.log(JSON.stringify({ killed: pids.length, pids }, null, 2));
