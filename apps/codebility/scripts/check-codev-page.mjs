// Rule 3 payload check: verifies the paginated codev list select returns the
// columns it claims and refuses to return the heavy joins. Run:
//   node --experimental-strip-types scripts/check-codev-page.mjs
//
// This exercises the pure helpers only; the Supabase round-trip is covered by
// scripts/p9-table-probe.mjs against a live server.
import assert from "node:assert/strict";

const { resolvePageArgs, toPage, DEFAULT_PAGE_SIZE } = await import(
  "../lib/server/paginate.ts"
);

// Defaults.
assert.deepEqual(resolvePageArgs(), {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  from: 0,
  to: DEFAULT_PAGE_SIZE - 1,
});

// Page 3 at 50/page must ask for rows 100..149, not 101..150. An off-by-one
// here silently drops the last row of every page.
assert.deepEqual(resolvePageArgs({ page: 3, pageSize: 50 }), {
  page: 3,
  pageSize: 50,
  from: 100,
  to: 149,
});

// Garbage in must not produce a negative range (PostgREST 416s).
assert.equal(resolvePageArgs({ page: 0 }).page, 1);
assert.equal(resolvePageArgs({ page: -5 }).from, 0);
assert.equal(resolvePageArgs({ pageSize: 0 }).pageSize, 1);
assert.equal(resolvePageArgs({ pageSize: 10_000 }).pageSize, 100);
assert.equal(resolvePageArgs({ page: 2.7 }).page, 2);

// toPage must survive a null data / null count pair without throwing.
const empty = toPage(null, null, 1, 50);
assert.deepEqual(empty, { rows: [], total: 0, page: 1, pageSize: 50 });

const rows = [{ id: "a" }, { id: "b" }];
assert.deepEqual(toPage(rows, 2, 1, 50).rows, rows);

// The list select must not carry the heavy relations the table never reads.
// Read as source: codev.service.ts imports "@/..." aliases that plain Node
// cannot resolve, so importing it here would fail on module linking.
const fs = await import("node:fs");
const serviceSrc = fs.readFileSync(
  new URL("../lib/server/codev.service.ts", import.meta.url),
  "utf8",
);
const CODEV_LIST_COLUMNS = serviceSrc.match(
  /CODEV_LIST_COLUMNS\s*=\s*"([^"]+)"/,
)?.[1];
assert.ok(CODEV_LIST_COLUMNS, "CODEV_LIST_COLUMNS not found in codev.service.ts");

for (const forbidden of ["education", "work_experience", "about", "project_members"]) {
  assert.ok(
    !CODEV_LIST_COLUMNS.includes(forbidden),
    `list select must not include ${forbidden}`,
  );
}
for (const required of [
  "id",
  "first_name",
  "last_name",
  "email_address",
  "image_url",
  "role_id",
  "display_position",
  "internal_status",
  "availability_status",
]) {
  assert.ok(
    CODEV_LIST_COLUMNS.includes(required),
    `list select missing ${required}`,
  );
}

console.log("check-codev-page: all assertions passed");
