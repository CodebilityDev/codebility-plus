// Test the services page's Preview Catalog + PDF export path end to end.
// This is the highest-risk untested path from the server/client split: the PDF
// generator queries #pdf-all-pages-hidden .pdf-page, a DOM contract.
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const PROFILE = path.join(os.tmpdir(), "codebility-phase2-profile");
const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });

const OUT = path.join(os.tmpdir(), "codebility-downloads");
fs.mkdirSync(OUT, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
  acceptDownloads: true,
});
const page = context.pages()[0] ?? (await context.newPage());
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 300)));

await page.goto("http://localhost:3000/home/settings/services", {
  waitUntil: "domcontentloaded",
  timeout: 300000,
});
await page.waitForTimeout(6000);

// 1. Open the preview.
const previewBtn = page.getByRole("button", { name: /preview catalog/i }).first();
const hadPreviewBtn = (await previewBtn.count()) > 0;
if (hadPreviewBtn) {
  await previewBtn.click();
  await page.waitForTimeout(5000);
}

// 2. Inspect the DOM contract the PDF generator depends on.
const dom = await page.evaluate(() => ({
  hiddenContainer: !!document.querySelector("#pdf-all-pages-hidden"),
  pdfPages: document.querySelectorAll("#pdf-all-pages-hidden .pdf-page").length,
  nonSplitPages: document.querySelectorAll(
    "#pdf-all-pages-hidden .pdf-page:not(.pdf-split-page)",
  ).length,
  hasDownloadBtn: [...document.querySelectorAll("button")].some((b) =>
    /download pdf/i.test(b.innerText),
  ),
}));

// 3. Click Download PDF and capture the file.
let download = null;
if (dom.hasDownloadBtn) {
  const dl = page.waitForEvent("download", { timeout: 120000 }).catch(() => null);
  await page
    .getByRole("button", { name: /download pdf/i })
    .first()
    .click();
  const d = await dl;
  if (d) {
    const dest = path.join(OUT, d.suggestedFilename());
    await d.saveAs(dest);
    const st = fs.statSync(dest);
    download = { name: d.suggestedFilename(), bytes: st.size };
  }
}

await page.screenshot({
  path: path.join(os.tmpdir(), "codebility-phase2-shots", "services-preview.png"),
});
console.log(JSON.stringify({ hadPreviewBtn, dom, download, errors }, null, 2));
await context.close();
