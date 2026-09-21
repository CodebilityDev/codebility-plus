// Reproduces the "Error fetching project members: Bad Request" report by
// running the exact two queries project-members-query.ts issues.
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const env = Object.fromEntries(
  fs
    .readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Which projects have "member" rows, and how many?
const { data: allMembers, error: allErr } = await sb
  .from("project_members")
  .select("project_id, codev_id, role");

if (allErr) {
  console.log("baseline project_members query error:", JSON.stringify(allErr));
} else {
  const byProject = {};
  for (const r of allMembers ?? []) {
    byProject[r.project_id] ??= { total: 0, member: 0, ids: [] };
    byProject[r.project_id].total++;
    if (r.role === "member") {
      byProject[r.project_id].member++;
      byProject[r.project_id].ids.push(r.codev_id);
    }
  }

  const projects = Object.entries(byProject);
  console.log(`projects with members: ${projects.length}`);

  // Now run the exact query for each project and report failures.
  let failures = 0;
  for (const [projectId, info] of projects) {
    const { data: pms, error: pmErr } = await sb
      .from("project_members")
      .select("codev_id, role, joined_at")
      .eq("project_id", projectId)
      .eq("role", "member");

    if (pmErr) {
      console.log(`  pm query FAILED for ${projectId}:`, JSON.stringify(pmErr));
      failures++;
      continue;
    }

    if (!pms?.length) continue;

    const ids = pms.map((p) => p.codev_id);
    const { error: codevErr } = await sb
      .from("codev")
      .select("id, first_name, last_name, email_address, display_position, image_url")
      .in("id", ids);

    if (codevErr) {
      console.log(
        `  codev .in() FAILED for ${projectId} (${ids.length} ids):`,
        JSON.stringify(codevErr),
      );
      failures++;
    }
  }

  console.log(`failures: ${failures}`);

  // Largest member list, and any null codev_id (which would break .in()).
  let maxIds = 0;
  let nulls = 0;
  for (const [, info] of projects) {
    maxIds = Math.max(maxIds, info.ids.length);
    nulls += info.ids.filter((i) => i == null).length;
  }
  console.log(`largest member id list: ${maxIds}`);
  console.log(`null codev_id values among members: ${nulls}`);
}
