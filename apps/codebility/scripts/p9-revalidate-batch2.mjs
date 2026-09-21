// One-off: revalidatePath for promote-modal and ticket-support mutations.
import fs from "node:fs";

const jobs = [
  {
    path: "actions/promote-modal/actions.ts",
    call: 'revalidatePath("/home/promote-modal");',
    // 158 toggle, 139 delete, 95 create, 65 upsert. 122 is a storage upload, skipped.
    lines: [158, 139, 95, 65],
  },
  {
    path: "actions/ticket-support/actions.ts",
    call: 'revalidatePath("/home/ticket-support");',
    lines: [47],
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
