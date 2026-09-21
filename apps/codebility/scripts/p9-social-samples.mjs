// Does calculate_social_points return anything other than 0 for users who
// actually have posts/comments/likes? A constant 0 would mean the feature is
// inert even though the RPC resolves.
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

// Pick authors who actually have posts.
const { data: posts } = await sb.from("posts").select("author_id").limit(200);
const authors = [...new Set((posts ?? []).map((p) => p.author_id).filter(Boolean))];

console.log(`authors with posts: ${authors.length}`);

const results = [];
for (const id of authors.slice(0, 12)) {
  const { data, error } = await sb.rpc("calculate_social_points", { codev_id: id });
  results.push({ id: id.slice(0, 8), points: error ? `ERR ${error.message}` : data });
}

const nonZero = results.filter((r) => typeof r.points === "number" && r.points !== 0);
console.log("samples:", JSON.stringify(results));
console.log(`non-zero results: ${nonZero.length} of ${results.length}`);
