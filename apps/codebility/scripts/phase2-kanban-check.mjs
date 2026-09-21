// Phase 2 regression target: kanban board drag-and-drop surface must still mount.
// Read-only verification: opens a board, counts columns/cards, checks dnd attrs.
//
// The task card and "Add a card" controls sit under dnd-kit pointer listeners,
// which consume synthetic clicks, so this script stops at the board surface and
// screenshots it. Reach the board (2 steps + dnd nodes) is the gate.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-phase2-profile");
const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1000 },
});
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 200)));

await page.goto("http://localhost:3000/home/kanban", {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(6000);

// Click through: project -> View Sprint -> View Board, to reach the dnd canvas.
const clickByText = async (re, label) => {
  const el = page.getByRole("button", { name: re }).first();
  if (await el.count()) {
    await el.click();
    await page.waitForTimeout(9000);
    return true;
  }
  return false;
};

const steps = [];
steps.push(["view sprint", await clickByText(/view sprint/i)]);
steps.push(["view board", await clickByText(/view board/i)]);
// Cards stream in after the column shells; wait for real content, then probe.
await page.waitForTimeout(12000);

const board = await page.evaluate(() => {
  const dnd = document.querySelectorAll("[data-rbd-draggable-id],[data-dnd-kit],[role='button'][aria-roledescription]");
  const tiptap = document.querySelectorAll(".ProseMirror,.tiptap");
  const cols = document.querySelectorAll("[data-column-id],[class*='kanban']");
  const taskCards = document.querySelectorAll('[data-type="Task"]');
  return {
    url: location.href,
    dndNodes: dnd.length,
    taskCards: taskCards.length,
    tiptapNodes: tiptap.length,
    kanbanish: cols.length,
    bodyLen: document.body.innerText.length,
    heading: document.querySelector("h1,h2")?.textContent?.slice(0, 80) ?? null,
  };
});

await page.screenshot({ path: path.join(os.tmpdir(), "codebility-phase2-shots", "kanban_board.png") });
console.log(JSON.stringify({ steps, board, errors }, null, 2));
await context.close();
