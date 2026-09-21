// Swap the 8 duplicated /api/profile-points/${id} fetches for the shared,
// deduplicating fetchProfilePoints helper.
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("app/home/settings/profile/_components");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".tsx"));

const report = [];

for (const file of files) {
  const p = path.join(dir, file);
  let src = fs.readFileSync(p, "utf8");
  const before = src;

  // Pattern A: effect/getter form
  //   const res = await fetch(`/api/profile-points/${X}`);
  //   if (res.ok) {
  //     const pointsData: { points?: ... } = await res.json() as {...};
  // -> const pointsData = await fetchProfilePoints(X);
  //    if (pointsData) {
  const reA =
    /const res = await fetch\(`\/api\/profile-points\/\$\{([^}]+)\}`\);\s*\r?\n(\s*)if \(res\.ok\) \{\s*\r?\n\s*const pointsData: \{[^}]*\} = \s*\r?\n\s*await res\.json\(\) as \{[^}]*\};\s*\r?\n/g;

  src = src.replace(reA, (_m, id, indent) => {
    return `const pointsData = await fetchProfilePoints(${id.trim()});\n${indent}if (pointsData) {\n`;
  });

  // Pattern B: try/catch-less variant used in some files
  const reB =
    /const response = await fetch\(`\/api\/profile-points\/\$\{([^}]+)\}`\);\s*\r?\n(\s*)if \(response\.ok\) \{\s*\r?\n\s*const [A-Za-z]+: \{[^}]*\} = await response\.json\(\) as \{[^}]*\};\s*\r?\n/g;

  src = src.replace(reB, (_m, id, indent) => {
    return `const pointsData = await fetchProfilePoints(${id.trim()});\n${indent}if (pointsData) {\n`;
  });

  // Pattern C: inline fetch without the res/if dance
  src = src.replace(
    /await fetch\(`\/api\/profile-points\/\$\{([^}]+)\}`\)/g,
    (_m, id) => `await fetchProfilePoints(${id.trim()})`,
  );

  if (src !== before) {
    // Add the import after the last existing import line.
    const lines = src.split(/\r?\n/);
    let lastImport = -1;
    lines.forEach((l, i) => {
      if (/^import\s/.test(l)) lastImport = i;
    });
    if (lastImport >= 0 && !src.includes("lib/client/profile-points")) {
      lines.splice(
        lastImport + 1,
        0,
        'import { fetchProfilePoints } from "@/lib/client/profile-points";',
      );
      src = lines.join("\n");
    }
    fs.writeFileSync(p, src, "utf8");
    report.push({ file, changed: true, remainingRawFetches: (src.match(/\/api\/profile-points/g) ?? []).length });
  } else {
    report.push({ file, changed: false });
  }
}

console.log(JSON.stringify(report, null, 2));
