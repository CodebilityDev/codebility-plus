// Phase 3: create loading.tsx for every in-scope /home route lacking one,
// mapping route -> shared skeleton shape per the plan.
import fs from "node:fs";
import path from "node:path";

const IMP = "@/app/home/_components/skeletons/RouteSkeletons";

// route -> skeleton export
const MAP = {
  // ListSkeleton: header + table rows
  "/home/admin-controls/appointments": "ListSkeleton",
  "/home/admin-controls/client-tracker": "ListSkeleton",
  "/home/admin-controls/ticket-support": "ListSkeleton",
  "/home/ticket-support": "ListSkeleton",
  "/home/settings/news-banners": "ListSkeleton",
  "/home/settings/surveys/[surveyId]/results": "ListSkeleton",
  "/home/settings/services/cms-diagnostic": "ListSkeleton",
  "/home/settings/services/diagnostic": "ListSkeleton",

  // FormSkeleton: labelled fields / detail panes
  "/home/account-settings": "FormSkeleton",
  "/home/settings/account-settings": "FormSkeleton",
  "/home/hire/applications/[jobId]": "FormSkeleton",
  "/home/promote-modal": "FormSkeleton",
  "/home/promote-modal/[id]": "FormSkeleton",
  "/home/certificate-preview": "FormSkeleton",

  // CardsSkeleton: card grids
  "/home/feeds": "CardsSkeleton",
  "/home/overflow": "CardsSkeleton",
  "/home/hire": "CardsSkeleton",
  "/home/settings/services": "CardsSkeleton",

  // DetailSkeleton: sidebar + main
  "/home/my-team/[projectId]": "DetailSkeleton",
};

// Skipped on purpose (plan 5.3/5.4): test routes are proposed for deletion,
// kanban is a hard exclusion.
const SKIP = new Set(["/home/test-meeting-notification", "/home/test-notifications"]);

const created = [];
const skipped = [];
const missingDir = [];

for (const [route, shape] of Object.entries(MAP)) {
  const dir = path.join(process.cwd(), "app", route.replace(/^\//, ""));
  if (!fs.existsSync(dir)) {
    missingDir.push(route);
    continue;
  }
  const file = path.join(dir, "loading.tsx");
  if (fs.existsSync(file)) {
    skipped.push(route + " (already had loading.tsx)");
    continue;
  }
  const body = `import { ${shape} } from "${IMP}";

const Loading = () => {
  return <${shape} />;
};

export default Loading;
`;
  fs.writeFileSync(file, body, "utf8");
  created.push(`${route} -> ${shape}`);
}

console.log(JSON.stringify({ created, skipped, missingDir, skippedByDesign: [...SKIP] }, null, 2));
