// One-off: revalidatePath for dashboard mutations. These functions return
// void (or throw), so the call goes at the end of the mutation body.
import fs from "node:fs";

const path = "actions/dashboard/actions.ts";
const lines = fs.readFileSync(path, "utf8").split(/\r?\n/);

// Insert before these closing points, bottom-up. Each is the line AFTER the
// last statement of a mutating function.
const targets = [
  { line: 138, indent: "  ", call: 'revalidatePath("/home");' }, // logUserTime -> end
];

// simpler: append revalidate at each specific anchor by exact text match
const anchors = [
  { after: "  await stopUserTimer(codevId);\n", call: '  revalidatePath("/home");' },
  { after: "    if (error) throw error;\n  } catch (error) {\n    console.error(error);\n  }\n", call: '  revalidatePath("/home");' },
];

let out = lines.join("\n");

// logUserTime ends with stopUserTimer
out = out.replace(
  /(  await stopUserTimer\(codevId\);\n)/,
  '$1\n  revalidatePath("/home");\n',
);

// updateUserAvailabilityStatus catches; revalidate before the closing brace
out = out.replace(
  /(      availability_status: status,\n      \}\)\n      \.eq\("id", userId\);\n\n    if \(error\) throw error;\n)/,
  '$1    revalidatePath("/home");\n',
);

if (!out.includes('from "next/cache"')) {
  out = out.replace(
    /("use server";\r?\n)/,
    '$1\nimport { revalidatePath } from "next/cache";',
  );
}

fs.writeFileSync(path, out, "utf8");
const count = (out.match(/revalidatePath\("\/home"\)/g) ?? []).length;
console.log("inserted", count, "calls");
