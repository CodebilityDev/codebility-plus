// Attaches to headless Chrome over CDP and reports real render/performance data.
//
// Usage:
//   node scripts/perf-probe.mjs <url> [--seconds=10] [--react]
//
// Requires Chrome started with --remote-debugging-port=9222.
// Reports: long tasks, layout shifts, navigation timings, JS heap, and (with
// --react) per-component render counts via the React DevTools global hook.

const CDP = process.env.CDP_URL ?? "http://127.0.0.1:9222";

const url = process.argv[2];
if (!url) {
  console.error("usage: node scripts/perf-probe.mjs <url> [--seconds=10] [--react]");
  process.exit(1);
}
const secs = Number(
  (process.argv.find((a) => a.startsWith("--seconds=")) ?? "--seconds=10").split("=")[1],
);
const wantReact = process.argv.includes("--react");

const listTargets = async () => (await fetch(`${CDP}/json/list`)).json();

// Use the already-open tab so the URL keeps its logged-in session.
const targets = await listTargets();
const page = targets.find((t) => t.type === "page");
if (!page) throw new Error("no page target; is Chrome running with --remote-debugging-port?");

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});

let id = 0;
const pending = new Map();
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
};
const send = (method, params = {}) =>
  new Promise((res) => {
    const n = ++id;
    pending.set(n, (msg) => res(msg.result ?? msg.error));
    ws.send(JSON.stringify({ id: n, method, params }));
  });

// Inject the React DevTools hook BEFORE any app code runs, so React registers
// with it on mount. This is the same hook the DevTools extension installs.
if (wantReact) {
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {
        renderers: new Map(),
        supportsFiber: true,
        inject(renderer) { const id = this.renderers.size + 1; this.renderers.set(id, renderer); return id; },
        onCommitFiberRoot() {},
        onCommitFiberUnmount() {},
        onPostCommitFiberRoot() {},
        checkDCE() {},
      };
      (function () {
        const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        window.__renderCounts = {};
        const orig = hook.onCommitFiberRoot;
        hook.onCommitFiberRoot = function (rendererId, root, priority) {
          try {
            const counts = window.__renderCounts;
            const walk = (fiber) => {
              if (!fiber) return;
              const name =
                (fiber.type && (fiber.type.displayName || fiber.type.name)) ||
                (fiber.elementType && fiber.elementType.name) ||
                null;
              if (name) counts[name] = (counts[name] || 0) + 1;
              walk(fiber.child);
              walk(fiber.sibling);
            };
            walk(root.current);
          } catch (e) {}
          return orig && orig.apply(this, arguments);
        };
      })();
    `,
  });
}

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");
await send("Performance.enable");

const consoleErrors = [];
ws.addEventListener("message", (m) => {
  const msg = JSON.parse(m.data);
  if (msg.method === "Runtime.exceptionThrown") {
    consoleErrors.push(msg.params.exceptionDetails?.exception?.description ?? "exception");
  }
  if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
    consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description).join(" "));
  }
});

const evaluate = async (expression) => {
  const r = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (r?.exceptionDetails) return { error: r.exceptionDetails.text };
  return r?.result?.value;
};

// Instrument the observers before the app boots so we catch everything.
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `
    window.__perf = { longTasks: [], shifts: [], lcp: 0, cls: 0 };
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.__perf.longTasks.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) });
      }).observe({ entryTypes: ["longtask"] });
    } catch (e) {}
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) { if (!e.hadRecentInput) { window.__perf.cls += e.value; window.__perf.shifts.push(Math.round(e.value * 1000) / 1000); } }
      }).observe({ entryTypes: ["layout-shift"] });
    } catch (e) {}
    try {
      new PerformanceObserver((l) => {
        const es = l.getEntries(); window.__perf.lcp = Math.round(es[es.length - 1].startTime);
      }).observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {}
  `,
});

await send("Page.navigate", { url });
await new Promise((r) => setTimeout(r, secs * 1000));

const report = await evaluate(`(() => {
  const nav = performance.getEntriesByType("navigation")[0] || {};
  const paint = performance.getEntriesByType("paint");
  const fcp = paint.find(p => p.name === "first-contentful-paint");
  const mem = performance.memory ? {
    usedMB: Math.round(performance.memory.usedJSHeapSize / 1048576),
    totalMB: Math.round(performance.memory.totalJSHeapSize / 1048576),
  } : null;
  const lt = window.__perf ? window.__perf.longTasks : [];
  return {
    title: document.title,
    url: location.href,
    domNodes: document.getElementsByTagName("*").length,
    ttfb: Math.round(nav.responseStart || 0),
    domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
    loadEvent: Math.round(nav.loadEventEnd || 0),
    fcp: fcp ? Math.round(fcp.startTime) : null,
    lcp: window.__perf ? window.__perf.lcp : null,
    cls: window.__perf ? Math.round(window.__perf.cls * 1000) / 1000 : null,
    longTaskCount: lt.length,
    longTaskTotalMs: lt.reduce((a, b) => a + b.dur, 0),
    longTaskWorstMs: lt.length ? Math.max(...lt.map(t => t.dur)) : 0,
    reactRenderCounts: window.__renderCounts || null,
  };
})()`);

const metrics = await send("Performance.getMetrics");
const wanted = new Set(["JSHeapUsedSize", "JSHeapTotalSize", "Nodes", "LayoutCount", "RecalcStyleCount"]);
const perfMetrics = Object.fromEntries(
  (metrics?.metrics ?? []).filter((m) => wanted.has(m.name)).map((m) => [m.name, m.value]),
);

console.log(JSON.stringify({ report, perfMetrics, consoleErrors: consoleErrors.slice(0, 20) }, null, 2));
ws.close();
