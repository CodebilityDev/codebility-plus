// Lists in-scope /home routes and whether each has loading.tsx.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("app/home");
const EXCLUDE = /(^|[\\/])kanban([\\/]|$)/;

const routes = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (EXCLUDE.test(full)) continue;
      walk(full);
    } else if (e.name === "page.tsx") {
      routes.push(path.dirname(full));
    }
  }
};
walk(ROOT);

const rows = routes
  .map((d) => {
    const rel = "/" + path.relative(path.resolve("app"), d).split(path.sep).join("/");
    const hasLoading = fs.existsSync(path.join(d, "loading.tsx"));
    const page = fs.readFileSync(path.join(d, "page.tsx"), "utf8");
    const isClient = /^\s*["']use client["']/m.test(page);
    return { route: rel, hasLoading, isClient };
  })
  .sort((a, b) => a.route.localeCompare(b.route));

console.log(
  JSON.stringify(
    {
      total: rows.length,
      missingLoading: rows.filter((r) => !r.hasLoading).map((r) => r.route),
      clientPages: rows.filter((r) => r.isClient).map((r) => r.route),
      all: rows,
    },
    null,
    2,
  ),
);
