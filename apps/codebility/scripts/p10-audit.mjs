// Static contract audit for every /home list route.
// For each route reports: does the server page fetch a PAGE or the whole table,
// does the client slice in memory, is filter/search input debounced before it
// reaches a query key, and is there a loading skeleton bound to isFetching.
// Read-only. Output is the input to the Phase 10 plan.
import fs from "node:fs";
import path from "node:path";

const HOME = path.resolve("app/home");
const SKIP = /(^|[\\/])(kanban|test-notifications|test-meeting-notification)([\\/]|$)/;

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

// A route dir is a "list route" if any file paginates or renders a table/grid.
const routeDirs = fs
  .readdirSync(HOME, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !SKIP.test(e.name))
  .map((e) => path.join(HOME, e.name));

const PAGINATED_SERVER = /getCodevsPage|\.range\(|Page<|PageArgs|pageSize\s*[,:)]|count:\s*"exact"/;
const CLIENT_SLICE = /usePagination\(|\.slice\(\s*\(?\s*(currentPage|page)\b/;
const PAGINATED_CLIENT = /usePaginatedQuery/;
const DEBOUNCE = /useDeferredValue|useDebounce|debounce\(|setTimeout\([^)]*\b(search|query|term)/i;
const SEARCH_INPUT = /onChange=\{\s*\(e\)\s*=>\s*on\w*(Filter|Search)\w*\(/;
const SKELETON_BOUND = /isFetching|isPending|isLoading/;
const SKELETON_RENDER = /Skeleton|animate-pulse/;

const rows = [];
for (const dir of routeDirs) {
  const files = walk(dir);
  if (!files.length) continue;
  const pageFile = files.find((f) => /[\\/]page\.tsx$/.test(f) && path.dirname(f) === dir);
  const all = files.map((f) => ({ f, src: read(f) }));
  const blob = all.map((a) => a.src).join("\n");

  const hasTable = /\<(table|Table)|DataTable|CardContainer|Grid\b/.test(blob);
  const hasPagingUI = /currentPage|setPage\(|Pagination/.test(blob);
  if (!hasTable && !hasPagingUI) continue;

  const pageSrc = pageFile ? read(pageFile) : "";
  const serverPaginates = PAGINATED_SERVER.test(pageSrc);
  const clientSlices = CLIENT_SLICE.test(blob);
  const usesPaginatedQuery = PAGINATED_CLIENT.test(blob);

  const searchFiles = all.filter((a) => SEARCH_INPUT.test(a.src));
  const hasSearchInput = searchFiles.length > 0;
  const debounced = DEBOUNCE.test(blob);

  // Skeleton must be rendered in a file that also observes a fetching flag.
  const skeletonWired = all.some((a) => SKELETON_BOUND.test(a.src) && SKELETON_RENDER.test(a.src));

  const problems = [];
  if (!serverPaginates && hasPagingUI) problems.push("server fetches whole table");
  if (clientSlices) problems.push("client slices in memory");
  if (hasSearchInput && !debounced) problems.push("SEARCH NOT DEBOUNCED -> request per keystroke");
  if (usesPaginatedQuery && !skeletonWired) problems.push("no skeleton bound to fetching state");

  rows.push({
    route: "/home/" + path.basename(dir),
    serverPaginates,
    usesPaginatedQuery,
    clientSlices,
    hasSearchInput,
    debounced,
    skeletonWired,
    status: problems.length ? "FAIL" : "ok",
    problems,
  });
}

rows.sort((a, b) => (a.status === b.status ? a.route.localeCompare(b.route) : a.status === "FAIL" ? -1 : 1));

console.log(
  JSON.stringify(
    {
      totalListRoutes: rows.length,
      failing: rows.filter((r) => r.status === "FAIL").length,
      passing: rows.filter((r) => r.status === "ok").length,
      routes: rows,
    },
    null,
    2,
  ),
);
