// Full verification suite for the /home performance work.
//
// Covers, per route: render correctness, page errors, server-action POST count,
// and navigation timing. Then exercises the interactive paths that the
// refactors touched (feeds filter drawer, overflow like toggle, contact save).
//
// Usage: node scripts/suite.mjs [--quick]
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);

const BASE = process.env.SUITE_BASE ?? "http://localhost:3000";
// Reuse the signed-in profile the main dev flow uses, so the suite does not
// need its own login. OVERRIDE with SUITE_PROFILE / SUITE_SHARED if needed.
const SHARED = process.env.SUITE_SHARED ?? path.join(os.tmpdir(), "codebility-run-profile");
const PROFILE = process.env.SUITE_PROFILE ?? path.join(os.tmpdir(), "codebility-suite-profile");

// Fail loudly when the source profile is missing. Previously this fell through
// to an empty profile, so the suite silently sat on a sign-in page and every
// assertion "passed" against nothing.
if (!fs.existsSync(PROFILE)) {
  if (!fs.existsSync(SHARED)) {
    console.error(
      [
        `suite: no Chrome profile to run against.`,
        `  looked for: ${SHARED}`,
        ``,
        `Start the dev environment first (scripts\\up.ps1) and sign in once,`,
        `or point SUITE_SHARED at an existing authenticated profile.`,
      ].join("\n"),
    );
    process.exit(2);
  }
  fs.cpSync(SHARED, PROFILE, { recursive: true });
}

const SHOTS = path.join(os.tmpdir(), "codebility-suite-shots");
fs.mkdirSync(SHOTS, { recursive: true });

const quick = process.argv.includes("--quick");

// Headless by default: this suite used to open a second visible Chrome on its
// own profile, which stole focus and collided with the shared debug browser.
// Set SUITE_HEADED=1 only when you actually want to watch it.
const headed = process.env.SUITE_HEADED === "1";

const context = await chromium.launchPersistentContext(PROFILE, {
  headless: !headed,
  chromiumSandbox: true,
  channel: "chrome",
  viewport: { width: 1600, height: 1200 },
});
const page = context.pages()[0] ?? (await context.newPage());

// ---- instrumentation -------------------------------------------------------
let actions = [];      // server-action POSTs (next-action header)
let apiCalls = [];     // REST API GETs we care about
let pageErrors = [];

page.on("request", (r) => {
  const h = r.headers();
  if (r.method() === "POST" && h["next-action"]) {
    actions.push(h["next-action"].slice(0, 8));
  }
  if (/\/api\/(profile-points|codev\/[^/]+\/points)/.test(r.url())) {
    apiCalls.push(r.url().replace(BASE, ""));
  }
});
page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 200)));
page.on("console", (m) => {
  if (m.type() === "error" && !/favicon|404 \(Not Found\)|Failed to load resource/i.test(m.text())) {
    pageErrors.push("console: " + m.text().slice(0, 160));
  }
});

const reset = () => {
  actions = [];
  apiCalls = [];
  pageErrors = [];
};

const tally = (arr) => {
  const t = {};
  for (const a of arr) t[a] = (t[a] ?? 0) + 1;
  return t;
};

const results = { routes: [], interactions: [], timings: [], notes: [] };

// The 3 actions the /home layout always issues (survey x2 + notifications).
const LAYOUT_ACTIONS = 3;

// ---- route checks ----------------------------------------------------------
async function checkRoute(name, url, expect) {
  // Warm pass so we measure steady state, not a Turbopack cold compile.
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(4000);

  reset();
  const t0 = Date.now();
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 300000 });
  const domMs = Date.now() - t0;
  await page.waitForTimeout(expect.settle ?? 8000);

  const ui = await page.evaluate((probe) => {
    const txt = document.body.innerText;
    const out = { bodyLen: txt.length, heading: document.querySelector("h1")?.textContent?.trim() ?? null };
    for (const [key, re] of Object.entries(probe)) {
      out[key] = new RegExp(re, "i").test(txt);
    }
    // Narrowing a server select can leave a field undefined while the page still
    // renders without error, so assert on the rendered text instead. innerText
    // excludes <script>, so the RSC flight payload does not match here.
    const bad = txt.match(/[^\n]*\b(?:undefined|null|NaN)\b[^\n]*/);
    out.undefinedText = !!bad;
    out.undefinedSample = bad ? bad[0].trim().slice(0, 140) : null;
    out.blankName = txt.split("\n").some((l) => /^\s*(undefined|null|NaN)\s*$/.test(l));
    return out;
  }, expect.probes ?? {});

  const row = {
    route: name,
    url,
    domMs,
    actionPosts: actions.length,
    routeSpecificActions: Math.max(0, actions.length - LAYOUT_ACTIONS),
    actionGroups: tally(actions),
    apiCalls: apiCalls.length,
    ui,
    errors: [...pageErrors],
  };

  // Assertions
  row.pass = true;
  row.failures = [];
  if (pageErrors.length) {
    row.pass = false;
    row.failures.push(`${pageErrors.length} page error(s)`);
  }
  if (ui.undefinedText || ui.blankName) {
    row.pass = false;
    row.failures.push("rendered undefined/null/NaN text");
  }
  for (const [key, want] of Object.entries(expect.require ?? {})) {
    if (ui[key] !== want) {
      row.pass = false;
      row.failures.push(`${key}=${ui[key]} expected ${want}`);
    }
  }
  if (expect.maxRouteActions !== undefined && row.routeSpecificActions > expect.maxRouteActions) {
    row.pass = false;
    row.failures.push(`routeActions=${row.routeSpecificActions} > ${expect.maxRouteActions}`);
  }
  if (expect.maxApiCalls !== undefined && row.apiCalls > expect.maxApiCalls) {
    row.pass = false;
    row.failures.push(`apiCalls=${row.apiCalls} > ${expect.maxApiCalls}`);
  }

  await page.screenshot({ path: path.join(SHOTS, name.replace(/\W+/g, "-") + ".png") });
  results.routes.push(row);
  return row;
}

// ---- 1. routes -------------------------------------------------------------
await checkRoute("home", "/home", {
  probes: { welcome: "welcome home", leaderboard: "leaderboard", points: "points overview" },
  require: { welcome: true, leaderboard: true, points: true },
  maxRouteActions: 0,
});

await checkRoute("feeds", "/home/feeds", {
  probes: { social: "social points", create: "create (your first )?post", trending: "trending" },
  require: { social: true, create: true },
});

await checkRoute("overflow", "/home/overflow", {
  probes: { title: "codev overflow", social: "social points", streak: "top streak board" },
  require: { title: true, social: true },
  maxRouteActions: 2,
});

await checkRoute("services", "/home/settings/services", {
  probes: { web: "web application development", ai: "ai development", hire: "codev for hire" },
  require: { web: true, ai: true, hire: true },
  maxRouteActions: 0,
});

await checkRoute("profile", "/home/settings/profile", {
  probes: { completion: "profile completion", skills: "skills", contact: "contact info" },
  require: { completion: true, skills: true },
  // 7 components used to each hit this endpoint; the shared cache must hold it low.
  maxApiCalls: 3,
});

await checkRoute("kanban (excluded, regression target)", "/home/kanban", {
  probes: { board: "kanban", projects: "project" },
  require: { board: true },
});

if (!quick) {
  await checkRoute("projects", "/home/projects", { probes: {}, require: {} });
  await checkRoute("admin-dashboard", "/home/admin-dashboard", {
    probes: { total: "total codevs", charts: "distribution charts" },
    require: { total: true },
  });
}

// my-team detail needs a real project id
const teamLink = await (async () => {
  await page.goto(BASE + "/home/my-team", { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(7000);
  return page.evaluate(() => {
    const a = [...document.querySelectorAll("a[href]")]
      .map((x) => x.getAttribute("href"))
      .find((h) => h && /^\/home\/my-team\/[0-9a-f-]{36}$/.test(h));
    return a ?? null;
  });
})();

if (teamLink) {
  await checkRoute("my-team detail", teamLink, {
    probes: { checklist: "checklist", members: "members" },
    require: { members: true },
    maxApiCalls: 12,
  });
}

// ---- 2. interactions -------------------------------------------------------

// 2a. feeds filter drawer (useOutsideClick extracted hook)
{
  await page.setViewportSize({ width: 900, height: 1100 }); // below xl -> toggle shows
  await page.goto(BASE + "/home/feeds", { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(7000);
  reset();

  const drawerOpen = () =>
    page.evaluate(() => {
      const i = document.querySelector('input[placeholder="Search posts..."]');
      return !!i && i.getBoundingClientRect().width > 0;
    });

  const initial = await drawerOpen();
  const btn = page.getByRole("button", { name: /filters/i }).first();
  let opened = null;
  let closedByOutside = null;
  if (await btn.count()) {
    await btn.click();
    await page.waitForTimeout(1200);
    opened = await drawerOpen();
    await page.mouse.click(40, 950); // far outside the drawer
    await page.waitForTimeout(1200);
    closedByOutside = !(await drawerOpen());
  }

  results.interactions.push({
    name: "feeds filter drawer / useOutsideClick",
    initialClosed: initial === false,
    opensOnClick: opened === true,
    closesOnOutsideClick: closedByOutside === true,
    errors: [...pageErrors],
    pass: initial === false && opened === true && closedByOutside === true && pageErrors.length === 0,
  });
  await page.setViewportSize({ width: 1600, height: 1200 });
}

// 2b. overflow like toggle (isLiked seeded from server likedPostIds)
{
  await page.goto(BASE + "/home/overflow", { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(9000);
  reset();

  // Scope to the question feed. A naive "button with an svg and a numeric
  // label" also matches the navbar notification bell, which is not clickable
  // as a like and made this check silently pass on the wrong element.
  const read = () =>
    page.evaluate(() => {
      const b = [...document.querySelectorAll("button")].find((x) => {
        const svg = x.querySelector("svg");
        return (
          svg &&
          /arrow-big-up/.test(svg.getAttribute("class") || "") &&
          x.getBoundingClientRect().top > 250
        );
      });
      return b
        ? {
            count: Number(b.innerText.trim()) || 0,
            active: /orange/.test(b.getAttribute("class") || ""),
          }
        : null;
    });

  const before = await read();
  const likeBtn = page
    .locator('button:has(svg[class*="arrow-big-up"])')
    .filter({ hasNotText: /view|comment/i })
    .first();

  let on = null;
  let off = null;
  if ((await likeBtn.count()) && before) {
    await likeBtn.click();
    await page.waitForTimeout(3500);
    on = await read();
    await likeBtn.click();
    await page.waitForTimeout(3500);
    off = await read();
  }

  const toggledUp = before && on && on.count === before.count + 1 && on.active;
  const toggledBack = before && off && off.count === before.count && !off.active;
  results.interactions.push({
    name: "overflow like toggle",
    before,
    afterLike: on,
    afterUnlike: off,
    errors: [...pageErrors],
    pass: !!(toggledUp && toggledBack) && pageErrors.length === 0,
  });
}

// 2c. contact info save -> invalidate -> refetch (the path never proven before)
{
  await page.goto(BASE + "/home/settings/profile", { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(10000);
  reset();
  const callsAfterLoad = apiCalls.length;

  // IconEdit is an <svg class="... cursor-pointer ..."> with an onClick.
  // NOTE: on SVG elements `className` is an SVGAnimatedString, so it must be
  // read with getAttribute("class") - that was the bug in the earlier attempt.
  const clickEdit = () =>
    page.evaluate(() => {
      const svgs = [...document.querySelectorAll("svg")].filter((s) =>
        (s.getAttribute("class") || "").includes("cursor-pointer"),
      );
      // Contact Info's pencil is the one nearest the phone input.
      const phone = [...document.querySelectorAll("input")].find((i) =>
        /phone/i.test(i.id + i.placeholder),
      );
      if (!phone || !svgs.length) return { ok: false, svgs: svgs.length };
      let best = null;
      let bestDist = Infinity;
      const py = phone.getBoundingClientRect().top;
      for (const s of svgs) {
        const d = Math.abs(s.getBoundingClientRect().top - py);
        if (d < bestDist) {
          bestDist = d;
          best = s;
        }
      }
      best.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      return { ok: true, svgs: svgs.length, dist: Math.round(bestDist) };
    });

  const clicked = await clickEdit();
  await page.waitForTimeout(2500);

  const inEdit = await page.evaluate(() => {
    const phone = [...document.querySelectorAll("input")].find((i) =>
      /phone/i.test(i.id + i.placeholder),
    );
    return {
      phoneEnabled: phone ? !phone.disabled : null,
      hasSubmit: !!document.querySelector('button[type="submit"]'),
      submitDisabled: document.querySelector('button[type="submit"]')?.disabled ?? null,
    };
  });

  let saved = null;
  let callsAfterSave = null;
  let restored = null;
  if (inEdit.phoneEnabled && inEdit.hasSubmit) {
    const website = page.locator("input#portfolio_website").first();
    const target = (await website.count()) ? website : page.locator('input[id*="phone" i]').first();
    const original = await target.inputValue();

    // Real keystrokes so react-hook-form marks the form dirty.
    await target.click();
    await target.press("End");
    await target.pressSequentially("9", { delay: 60 });
    await page.waitForTimeout(1200);

    const enabled = await page.evaluate(
      () => !document.querySelector('button[type="submit"]')?.disabled,
    );
    if (enabled) {
      await page.locator('button[type="submit"]').first().click();
      await page.waitForTimeout(7000);
      saved = await page.evaluate(() => ({
        leftEditMode: !document.querySelector('button[type="submit"]'),
        toast: /success|updated/i.test(document.body.innerText),
      }));
      callsAfterSave = apiCalls.length;

      // Restore the original value so the user's data is unchanged.
      await clickEdit();
      await page.waitForTimeout(2000);
      const t2 = (await website.count()) ? website : page.locator('input[id*="phone" i]').first();
      await t2.click();
      await t2.press("End");
      await t2.press("Backspace");
      await page.waitForTimeout(1200);
      const en2 = await page.evaluate(
        () => !document.querySelector('button[type="submit"]')?.disabled,
      );
      if (en2) {
        await page.locator('button[type="submit"]').first().click();
        await page.waitForTimeout(7000);
      }
      restored = (await t2.inputValue().catch(() => null)) === original;
    }
  }

  results.interactions.push({
    name: "contact info save -> invalidate -> refetch",
    editIconFound: clicked.ok,
    enteredEditMode: inEdit.phoneEnabled === true,
    saved,
    apiCallsOnLoad: callsAfterLoad,
    apiCallsAfterSave: callsAfterSave,
    refetchedAfterSave: callsAfterSave !== null && callsAfterSave > callsAfterLoad,
    valueRestored: restored,
    errors: [...pageErrors],
    pass:
      clicked.ok &&
      inEdit.phoneEnabled === true &&
      saved?.leftEditMode === true &&
      callsAfterSave !== null &&
      callsAfterSave > callsAfterLoad &&
      pageErrors.length === 0,
  });
}

// ---- 3. skeleton / loading.tsx behaviour ----------------------------------
{
  await page.goto(BASE + "/home", { waitUntil: "domcontentloaded", timeout: 300000 });
  await page.waitForTimeout(5000);
  for (const target of ["/home/feeds", "/home/overflow"]) {
    const r = await page.evaluate(async (route) => {
      const link = document.querySelector(`a[href="${route}"]`);
      if (!link) return { route, hadLink: false };
      const t0 = performance.now();
      link.click();
      let firstSkeletonAt = null;
      let max = 0;
      for (let i = 0; i < 200; i++) {
        await new Promise((res) => requestAnimationFrame(res));
        const n = document.querySelectorAll(".animate-pulse").length;
        if (n > 0) {
          max = Math.max(max, n);
          if (firstSkeletonAt === null) firstSkeletonAt = Math.round(performance.now() - t0);
        }
        if (performance.now() - t0 > 3000) break;
      }
      return { route, hadLink: true, firstSkeletonAt, maxSkeletons: max, landed: location.pathname };
    }, target);
    results.timings.push({ kind: "skeleton", ...r, pass: r.hadLink ? r.firstSkeletonAt !== null : null });
    await page.goto(BASE + "/home", { waitUntil: "domcontentloaded", timeout: 300000 });
    await page.waitForTimeout(3000);
  }
}

// ---- 4. RSC navigation timing (3 runs) ------------------------------------
{
  const routes = ["/home", "/home/kanban", "/home/feeds"];
  for (const r of routes) {
    const runs = [];
    for (let i = 0; i < 3; i++) {
      const t = await page.evaluate(async (route) => {
        const url = route + "?_rsc=suite" + Date.now();
        const t0 = performance.now();
        const res = await fetch(url, { headers: { RSC: "1" } });
        const ttfb = performance.now() - t0;
        await res.text();
        return { status: res.status, ttfb: Math.round(ttfb) };
      }, r);
      runs.push(t.ttfb);
      await page.waitForTimeout(600);
    }
    results.timings.push({
      kind: "rsc",
      route: r,
      runs,
      min: Math.min(...runs),
      max: Math.max(...runs),
    });
  }
}

// ---- summary ---------------------------------------------------------------
const routeFails = results.routes.filter((r) => !r.pass);
const interactionFails = results.interactions.filter((i) => !i.pass);
results.summary = {
  routesChecked: results.routes.length,
  routesPassed: results.routes.length - routeFails.length,
  routeFailures: routeFails.map((r) => ({ route: r.route, why: r.failures, errors: r.errors })),
  interactionsChecked: results.interactions.length,
  interactionsPassed: results.interactions.length - interactionFails.length,
  interactionFailures: interactionFails.map((i) => i.name),
  totalPageErrors: results.routes.reduce((s, r) => s + r.errors.length, 0),
  shots: SHOTS,
};

console.log(JSON.stringify(results, null, 2));
await context.close();
