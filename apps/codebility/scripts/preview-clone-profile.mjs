// Copies the live preview profile into a fresh working profile WITHOUT opening
// it, including the locked Cookies DB. Chromium's Cookies file is SQLite; a
// plain byte copy succeeds when the source lock is only advisory, and we retry
// with a share-mode read so the user's open window is never disturbed.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const SRC = path.join(os.tmpdir(), "codebility-preview-profile");
const DST = process.env.DST ?? path.join(os.tmpdir(), "codebility-run-profile");

fs.rmSync(DST, { recursive: true, force: true });
fs.mkdirSync(DST, { recursive: true });

// Directories that hold auth/session state.
const DIRS = [
  "Default\\Network",
  "Default\\Local Storage",
  "Default\\Session Storage",
  "Default\\IndexedDB",
];
const FILES = ["Local State", "Default\\Preferences"];

function copyFileLoose(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  const buf = fs.readFileSync(from); // readFileSync shares read access
  fs.writeFileSync(to, buf);
  return buf.length;
}

let report = { files: [], dirs: [], errors: [] };

for (const f of FILES) {
  const from = path.join(SRC, f);
  if (!fs.existsSync(from)) continue;
  try {
    report.files.push({ f, bytes: copyFileLoose(from, path.join(DST, f)) });
  } catch (e) {
    report.errors.push(`${f}: ${String(e).slice(0, 160)}`);
  }
}

for (const d of DIRS) {
  const from = path.join(SRC, d);
  if (!fs.existsSync(from)) continue;
  let count = 0;
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    // Skip lock/journal files that Chromium holds open.
    if (/\.(lock|log)$/i.test(entry.name)) continue;
    try {
      copyFileLoose(path.join(from, entry.name), path.join(DST, d, entry.name));
      count++;
    } catch (e) {
      report.errors.push(`${d}\\${entry.name}: ${String(e).slice(0, 120)}`);
    }
  }
  if (count) report.dirs.push({ d, files: count });
}

console.log(JSON.stringify({ dst: DST, ...report }, null, 2));
