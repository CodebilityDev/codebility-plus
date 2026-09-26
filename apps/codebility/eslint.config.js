import path from "node:path";

import baseConfig from "@codevs/eslint-config/base";
import nextjsConfig from "@codevs/eslint-config/nextjs";
import reactConfig from "@codevs/eslint-config/react";

// Folder rules from AGENTS.md:
// - app/ holds Next.js routing files only.
// - Every other folder is <folder>/global/... or <folder>/<route>/...
// - A file may import from any global/ folder and from folders of its own
//   route, and from nothing else.
const ROOT = import.meta.dirname;
const FOLDERS = new Set(["actions", "components", "constants", "hooks", "lib", "providers", "store", "styles", "types", "utils"]);
const ROUTE_FILE = /^(page|layout|loading|error|not-found|route|template|default|global-error|sitemap|robots)\.(tsx?|jsx?)$/;

const toSegments = (file) => path.relative(ROOT, file).split(path.sep);

// Route of a file: "" means global. `null` means the rule doesn't apply.
function routeOf(segments) {
  const [top, ...rest] = segments;
  if (top === "app") {
    return rest
      .slice(0, -1)
      .filter((s) => !s.startsWith("["))
      .map((s) => s.replace(/^\((.*)\)$/, "$1"))
      .join("/");
  }
  if (FOLDERS.has(top)) return rest[0] === "global" ? "" : rest.slice(0, -1).join("/");
  return null;
}

const routeScope = {
  meta: { type: "problem", schema: [] },
  create(context) {
    const fromSegments = toSegments(context.filename);
    const fromRoute = routeOf(fromSegments);
    if (fromRoute === null) return {};
    const inApp = fromSegments[0] === "app";

    function check(node) {
      const spec = node.source && node.source.value;
      if (typeof spec !== "string") return;
      let target;
      if (spec.startsWith("@/")) target = path.join(ROOT, spec.slice(2));
      else if (spec.startsWith(".")) target = path.resolve(path.dirname(context.filename), spec);
      else return;
      const segments = toSegments(target);
      if (segments[0] === "app") {
        const sameFolder = inApp && path.dirname(target) === path.dirname(context.filename);
        if (!sameFolder) context.report({ node: node.source, message: "Don't import from app/. Move the code to components/, lib/ or another folder (see AGENTS.md)." });
        return;
      }
      const targetRoute = routeOf(segments);
      if (targetRoute === null || targetRoute === "" || targetRoute === fromRoute) return;
      context.report({
        node: node.source,
        message: `"${spec}" belongs to route "${targetRoute}", but this file is in route "${fromRoute || "global"}". If both routes need it, move it to a global/ folder.`,
      });
    }

    return {
      Program(node) {
        if (inApp && !ROUTE_FILE.test(path.basename(context.filename))) {
          context.report({ node, message: "app/ holds routing files only. Put this file in components/<route>/ or another folder (see AGENTS.md)." });
        }
      },
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
      ImportExpression: check,
    };
  },
};

// Pre-existing debt: these rules already fail in code kept from before the
// 2026-09 cleanup, so they warn instead of error. New code should pass them.
// When a rule reaches zero warnings, delete it from this list.
const DEBT_RULES = [
  "@typescript-eslint/array-type",
  "@typescript-eslint/consistent-indexed-object-style",
  "@typescript-eslint/consistent-type-definitions",
  "@typescript-eslint/no-base-to-string",
  "@typescript-eslint/no-empty-function",
  "@typescript-eslint/no-floating-promises",
  "@typescript-eslint/no-inferrable-types",
  "@typescript-eslint/no-misused-promises",
  "@typescript-eslint/no-non-null-assertion",
  "@typescript-eslint/no-redundant-type-constituents",
  "@typescript-eslint/no-require-imports",
  "@typescript-eslint/no-unnecessary-condition",
  "@typescript-eslint/no-unnecessary-type-assertion",
  "@typescript-eslint/no-unsafe-argument",
  "@typescript-eslint/no-unsafe-assignment",
  "@typescript-eslint/no-unsafe-call",
  "@typescript-eslint/no-unsafe-member-access",
  "@typescript-eslint/no-unsafe-return",
  "@typescript-eslint/no-unused-expressions",
  "@typescript-eslint/no-unused-vars",
  "@typescript-eslint/no-wrapper-object-types",
  "@typescript-eslint/prefer-nullish-coalescing",
  "@typescript-eslint/prefer-optional-chain",
  "@typescript-eslint/prefer-promise-reject-errors",
  "@typescript-eslint/require-await",
  "import/consistent-type-specifier-style",
  "no-case-declarations",
  "no-constant-binary-expression",
  "no-useless-escape",
  "prefer-const",
  "react-hooks/immutability",
  "react-hooks/preserve-manual-memoization",
  "react-hooks/purity",
  "react-hooks/refs",
  "react-hooks/set-state-in-effect",
  "turbo/no-undeclared-env-vars",
];

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**", "public/**", "scripts/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { codebility: { rules: { "route-scope": routeScope } } },
    rules: {
      ...Object.fromEntries(DEBT_RULES.map((rule) => [rule, "warn"])),
      "@typescript-eslint/no-explicit-any": "off",
      "codebility/route-scope": "error",
    },
  },
];
