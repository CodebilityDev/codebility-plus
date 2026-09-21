// One-off: insert revalidatePath before the success returns of the settings
// actions. Line numbers are from the pre-edit file and are applied bottom-up.
import fs from "node:fs";

const jobs = [
  {
    path: "actions/settings/survey-questions.ts",
    call: 'revalidatePath("/home/settings/surveys");',
    lines: [219, 163, 125, 73],
  },
  {
    path: "actions/settings/services.ts",
    call: 'revalidatePath("/home/settings/services");',
    lines: [195, 170],
  },
];

for (const job of jobs) {
  const lines = fs.readFileSync(job.path, "utf8").split(/\r?\n/);

  for (const target of job.lines) {
    const idx = target - 1;
    const indent = (lines[idx].match(/^\s*/) ?? [""])[0];
    lines.splice(idx, 0, `${indent}${job.call}`, "");
  }

  let out = lines.join("\n");
  if (!out.includes('from "next/cache"')) {
    out = out.replace(
      /("use server";\r?\n)/,
      '$1\nimport { revalidatePath } from "next/cache";',
    );
  }

  fs.writeFileSync(job.path, out, "utf8");
  console.log(job.path, "->", job.lines.length, "calls");
}
