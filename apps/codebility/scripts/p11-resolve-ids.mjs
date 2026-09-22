// Resolves real IDs for every dynamic private route so the all-in-one probe can
// cover them. Run once; prints a JSON map consumed by p11-full-suite.mjs.
import fs from "node:fs";
import path from "node:path";

const env = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
const g = (k) => {
  const m = env.match(new RegExp("^" + k + "=(.+)", "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : null;
};
const url = g("NEXT_PUBLIC_SUPABASE_URL");
const key = g("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const H = { apikey: key, Authorization: "Bearer " + key };

const one = async (table, select, extra = "") => {
  const r = await fetch(
    `${url}/rest/v1/${table}?select=${encodeURIComponent(select)}&limit=1${extra}`,
    { headers: H },
  );
  if (r.status !== 200) return null;
  const j = await r.json();
  return j[0] ?? null;
};

const project = await one("projects", "id", "&order=created_at.desc");
const survey = await one("surveys", "id", "&order=created_at.desc");
const ticket = await one("ticket_support", "id,ticket_number", "&order=created_at.desc");
const modal = await one("feature_modals", "id", "&order=created_at.desc");
const job = await one("job_listings", "id", "&order=created_at.desc");

const ids = {
  projectId: project?.id ?? null,
  surveyId: survey?.id ?? null,
  ticketCode: ticket?.ticket_number ?? null,
  modalId: modal?.id ?? null,
  jobId: job?.id ?? null,
};

console.log(JSON.stringify(ids, null, 2));
