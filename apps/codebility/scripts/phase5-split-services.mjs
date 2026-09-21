// Phase 5 settings/services: split the 1536-line client page into a Server
// Component page (fetches projects + codev profiles) and a client island.
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("app/home/settings/services");
const pagePath = path.join(dir, "page.tsx");
const clientPath = path.join(dir, "_components", "ServicesPageClient.tsx");

let src = fs.readFileSync(pagePath, "utf8");
const before = src.length;

// 1. The island keeps everything except the "use client" directive and the
//    mount effect; it receives the fetched data as props instead of state.
const mountEffect = `
  // Fetch real projects and codev profiles on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResult, codevsResult] = await Promise.all([
          getRealProjects(),
          getCodevProfiles()
        ]);

        if (projectsResult.data && !projectsResult.error) {
          setRealProjects(projectsResult.data);
        }

        if (codevsResult.data && !codevsResult.error) {
          setCodevProfiles(codevsResult.data);
        }
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchData();
  }, []);
`;

if (!src.includes(mountEffect)) {
  console.error("MOUNT EFFECT NOT FOUND VERBATIM - aborting");
  process.exit(1);
}

src = src.replace(mountEffect, "");

// 2. Drop the now-unused action imports (the server page imports them instead).
src = src.replace(
  `import { getRealProjects, RealProject, getCodevProfiles } from "@/actions/settings/services";`,
  `import type { RealProject } from "@/actions/settings/services";`,
);

// 3. State -> props.
src = src.replace(
  `export default function ServicesPage() {
  const [realProjects, setRealProjects] = useState<RealProject[]>([]);
  const [codevProfiles, setCodevProfiles] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);`,
  `export default function ServicesPageClient({
  realProjects,
  codevProfiles,
}: {
  realProjects: RealProject[];
  codevProfiles: any[];
}) {`,
);

// 4. The island no longer reads these as state.
src = src.replace(
  `    if (isLoadingProjects) {
      toast.error("Projects are still loading. Please wait a moment and try again.");
      return;
    }

`,
  "",
);

// 5. useEffect may now be unused in the island.
if (!/useEffect\(/.test(src)) {
  src = src.replace(
    `import { useState, useEffect, useRef } from "react";`,
    `import { useState, useRef } from "react";`,
  );
}

src = src.replace(/^"use client";\r?\n\r?\n/, '"use client";\n\n');

fs.mkdirSync(path.dirname(clientPath), { recursive: true });
fs.writeFileSync(clientPath, src, "utf8");

// 6. New Server Component page.
const newPage = `import {
  getRealProjects,
  getCodevProfiles,
} from "@/actions/settings/services";

import ServicesPageClient from "./_components/ServicesPageClient";

export default async function ServicesPage() {
  // Both datasets were fetched in a client mount effect; resolving them here
  // means the catalog renders complete on first paint with no round trip.
  const [projectsResult, codevsResult] = await Promise.all([
    getRealProjects(),
    getCodevProfiles(),
  ]);

  return (
    <ServicesPageClient
      realProjects={projectsResult.data ?? []}
      codevProfiles={codevsResult.data ?? []}
    />
  );
}
`;
fs.writeFileSync(pagePath, newPage, "utf8");

console.log(
  JSON.stringify(
    {
      clientBytes: src.length,
      originalBytes: before,
      removedEffect: true,
      stillHasUseEffect: /useEffect\(/.test(src),
    },
    null,
    2,
  ),
);
