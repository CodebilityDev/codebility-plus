import { Linter } from "eslint";
import config from "./eslint.config.js";

const linter = new Linter({ configType: "flat" });
const file = "components/probe.tsx";
const code = "export const x = 1;\n";

const cfg = linter.getConfig ? null : null;
// compute resolved config for the file
const configs = config.filter((c) => !c.files || c.files.some((f) => new RegExp(f.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*")).test(file)));
const merged = {};
for (const c of configs) Object.assign(merged, c.rules ?? {});
const wanted = [
  "@typescript-eslint/no-unsafe-assignment",
  "@typescript-eslint/no-unsafe-member-access",
  "@typescript-eslint/no-unsafe-call",
  "@typescript-eslint/no-unsafe-argument",
  "@typescript-eslint/no-unsafe-return",
  "@typescript-eslint/prefer-nullish-coalescing",
  "@typescript-eslint/no-non-null-assertion",
  "@typescript-eslint/no-unnecessary-condition",
  "@typescript-eslint/no-floating-promises",
  "@typescript-eslint/require-await",
  "no-constant-condition",
];
for (const w of wanted) console.log(w.padEnd(50) + " -> " + JSON.stringify(merged[w] ?? "(not set)"));
