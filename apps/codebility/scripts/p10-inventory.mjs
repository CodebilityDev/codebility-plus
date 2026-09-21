// Complete inventory of every private /home route: how it fetches, whether it
// paginates, what it over-selects, and where its effects are. Read-only.
import fs from "node:fs";
import path from "node:path";

const HOME = path.resolve("app/home");
const read = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return ""; } };
const walk = (d, acc = []) => {
  if (!fs.existsSync(d)) return acc;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(tsx|ts)$/.test(e.name)) acc.push(p);
  }
  return acc;
};

const FETCH_IN_EFFECT =
  /await\s+(fetch|get[A-Z]|fetch[A-Z]|load[A-Z]|search[A-Z]|check[A-Z]|count[A-Z]|list[A-Z])|supabase\s*\.\s*from\(/;

const routes = [];
for (const entry of fs.readdirSync(HOME, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const dir = path.join(HOME, entry.name);
  const files = walk(dir);
  if (!files.length) continue;

  const pageFiles = files.filter((f) => /[\\/]page\.tsx$/.test(f));
  if (!pageFiles.length) continue;

  const docs = files.map((f) => ({ f, src: read(f) }));
  const blob = docs.map((d) => d.src).join("\n");
  const rootPage = read(path.join(dir, "page.tsx"));

  let effects = 0;
  let fetchEffects = 0;
  for (const { src } of docs) {
    const lines = src.split(/\r?\n/);
    lines.forEach((l, i) => {
      if (!/useEffect\(/.test(l)) return;
      effects++;
      if (FETCH_IN_EFFECT.test(lines.slice(i, i + 26).join("\n"))) fetchEffects++;
    });
  }

  routes.push({
    route: "/home/" + entry.name,
    subPages: pageFiles.length,
    rootPageIsClient: /^\s*["']use client["']/m.test(rootPage),
    rootPageAwaits: (rootPage.match(/await /g) ?? []).length,
    effects,
    fetchEffects,
    selectStar: (blob.match(/\.select\(\s*"\*"/g) ?? []).length,
    serverPaginates: /\.range\(|getCodevsPage|Page<|count:\s*"exact"/.test(rootPage),
    usesPaginatedQuery: /usePaginatedQuery/.test(blob),
    clientSlice: /usePagination\(|\.slice\(\s*\(?\s*(currentPage|page)\b/.test(blob),
    hasSearch: /placeholder=["'][^"']*[Ss]earch/.test(blob),
    hasDebounce: /useDeferredValue|useDebounce|debounce\(/.test(blob),
    hasPagingUI: /currentPage|setPage\(|Pagination/.test(blob),
    skeletonBoundToFetch: docs.some(
      (d) => /isFetching|isPending/.test(d.src) && /Skeleton|animate-pulse/.test(d.src),
    ),
    files: files.length,
  });
}

routes.sort((a, b) => b.fetchEffects - a.fetchEffects || b.effects - a.effects);

const flag = (r) => {
  const f = [];
  if (r.fetchEffects) f.push(`${r.fetchEffects} fetch-effects`);
  if (r.hasPagingUI && !r.serverPaginates && !r.usesPaginatedQuery) f.push("unpaginated fetch");
  if (r.clientSlice) f.push("client slice");
  if (r.hasSearch && !r.hasDebounce) f.push("search undebounced");
  if (r.usesPaginatedQuery && !r.skeletonBoundToFetch) f.push("no fetch skeleton");
  if (r.rootPageIsClient) f.push("client page.tsx");
  if (r.rootPageAwaits === 0 && !r.rootPageIsClient) f.push("page.tsx awaits nothing");
  if (r.selectStar) f.push(`${r.selectStar} select(*)`);
  return f;
};

console.log(
  JSON.stringify(
    {
      totalRoutes: routes.length,
      routes: routes.map((r) => ({ route: r.route, effects: r.effects, issues: flag(r) })),
    },
    null,
    2,
  ),
);
