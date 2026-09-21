// Reports which columns actually exist for the time-tracker query, by asking
// PostgREST for one row and letting it name the unknown column. Read-only.
import fs from "node:fs";
import path from "node:path";

const envPath = path.resolve(".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("missing supabase env");
  process.exit(1);
}

const probe = async (label, table, select) => {
  const res = await fetch(`${url}/rest/v1/${table}?select=${encodeURIComponent(select)}&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const body = await res.text();
  console.log(`${label.padEnd(34)} ${res.status}  ${body.slice(0, 150)}`);
};

await probe("codev: start_time,end_time", "codev", "start_time,end_time");
await probe("codev: user_id", "codev", "user_id");
await probe("codev: id", "codev", "id");
await probe("time_log: worked_hours,excess_hours", "time_log", "worked_hours,excess_hours");
await probe("time_log: *", "time_log", "*");
