// Is the RPC that getSocialPoints calls still present? If it is gone, every
// caller receives an error and the UI silently shows 0.
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

const { data: anyCodev } = await sb.from("codev").select("id").limit(1).maybeSingle();
const id = anyCodev?.id ?? "00000000-0000-0000-0000-000000000000";

const { data, error } = await sb.rpc("calculate_social_points", { codev_id: id });

console.log("calculate_social_points rpc:");
console.log("  error:", error ? `${error.code ?? ""} ${error.message}` : "none");
console.log("  data:", data);

// Does the referenced table still exist?
const { error: tableErr } = await sb
  .from("social_points_categories")
  .select("id")
  .limit(1);

console.log("social_points_categories table:");
console.log("  error:", tableErr ? `${tableErr.code ?? ""} ${tableErr.message}` : "none");
