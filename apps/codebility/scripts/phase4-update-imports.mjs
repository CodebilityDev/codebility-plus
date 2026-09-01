import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const replacements = [
  ["@/hooks/use-pagination", "@/hooks/data/use-pagination"],
  ["@/hooks/use-techstack", "@/hooks/data/use-techstack"],
  ["@/hooks/use-timeavail", "@/hooks/data/use-timeavail"],
  ["@/hooks/useCountries", "@/hooks/data/useCountries"],
  ["@/hooks/useLocalStorageValue", "@/hooks/data/useLocalStorageValue"],
  ["@/hooks/useToast", "@/hooks/ui/useToast"],
  ["@/hooks/useSlider", "@/hooks/ui/useSlider"],
  ["@/hooks/useFadeAnimation", "@/hooks/ui/useFadeAnimation"],
  ["@/hooks/usePageAnimationSettings", "@/hooks/ui/usePageAnimationSettings"],
  ["@/hooks/useImageCrop", "@/hooks/ui/useImageCrop"],
  ["@/hooks/use-media-query", "@/hooks/ui/use-media-query"],
  ["@/hooks/useDragAndDrop", "@/hooks/ui/useDragAndDrop"],
  ["@/hooks/reactQuery", "@/hooks/query/reactQuery"],
  ["@/hooks/requestHandler", "@/hooks/query/requestHandler"],
  ["@/hooks/toastHandler", "@/hooks/query/toastHandler"],
  ["@/app/home/_hooks/use-user", "@/hooks/home/use-user"],
  ["@/app/home/_hooks/supabase/use-fetch-enum", "@/hooks/home/use-fetch-enum"],
  ["@/app/applicant/onboarding/_service/action", "@/actions/applicant-onboarding/actions"],
  ["@/app/applicant/onboarding/_service/type", "@/types/applicant-onboarding"],
  ["@/app/applicant/waiting/_service/action", "@/actions/applicant-waiting/actions"],
  ["@/app/applicant/waiting/_service/type", "@/types/applicant-waiting"],
  ["@/app/applicant/waiting/_service/util", "@/utils/applicant-waiting"],
  ["@/app/auth/declined/_service/actions", "@/actions/auth/declined"],
  ["@/app/auth/declined/_service/util", "@/utils/auth/declined"],
  ["@/app/home/interns/_lib/codevpriority", "@/utils/codev-priority"],
  ['from "../_services/query"', 'from "@/lib/feeds/query"'],
  ['from "../_services/types"', 'from "@/types/feeds"'],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|md)$/.test(entry.name)) files.push(full);
  }
  return files;
}

let count = 0;
for (const file of walk(root)) {
  if (file.includes(`${path.sep}scripts${path.sep}`)) continue;
  let content = fs.readFileSync(file, "utf8");
  let next = content;
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  if (next !== content) {
    fs.writeFileSync(file, next);
    count++;
  }
}
console.log(`Phase 4: updated imports in ${count} files`);
