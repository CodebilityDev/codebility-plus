import fs from "node:fs";

import baseConfig from "@codevs/eslint-config/base";
import nextjsConfig from "@codevs/eslint-config/nextjs";
import reactConfig from "@codevs/eslint-config/react";

const dirs = (path) =>
  fs
    .readdirSync(path, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

// Legacy: several shared files and layouts still import from the marketing
// route group. Move those modules to components/ or lib/ instead of adding
// new exceptions here.
const LEGACY = "./(marketing)";

// Folder boundaries (see AGENTS.md). Zones are read from disk, so a new route
// folder is covered as soon as it exists.
const boundaryZones = [
  {
    target: ["./actions", "./components", "./constants", "./hooks", "./lib", "./store", "./types", "./utils"],
    from: "./app",
    except: [LEGACY],
    message: "Shared code must not import from app/. Move the module out of the route folder.",
  },
  ...dirs("./app").map((route) => ({
    target: `./app/${route}`,
    from: "./app",
    except: [...new Set([`./${route}`, LEGACY])],
    message: "Route folders must not import from sibling routes. Move shared code to components/ or lib/.",
  })),
  ...dirs("./app/home")
    .filter((feature) => !feature.startsWith("_"))
    .map((feature) => ({
      target: `./app/home/${feature}`,
      from: "./app/home",
      except: [`./${feature}`, "./_components"],
      message: "A /home feature must not import from another /home feature.",
    })),
];

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
    settings: {
      "import/resolver": { typescript: { project: "./tsconfig.json" } },
    },
    rules: {
      ...Object.fromEntries(DEBT_RULES.map((rule) => [rule, "warn"])),
      "@typescript-eslint/no-explicit-any": "off",
      "import/no-restricted-paths": ["error", { zones: boundaryZones }],
    },
  },
];
