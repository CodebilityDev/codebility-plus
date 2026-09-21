// Runnable check for lib/client/profile-points.ts: the dedup cache is the piece
// I wrote, so this exercises its real branches without a browser.
// Run: node --experimental-strip-types scripts/check-profile-points.mjs
import assert from "node:assert/strict";

// Minimal fetch stub so the module can be imported under plain Node.
let calls = 0;
let failNext = false;
globalThis.fetch = async () => {
  calls++;
  if (failNext) {
    failNext = false;
    return { ok: false, status: 500, json: async () => ({}) };
  }
  return { ok: true, json: async () => ({ totalPoints: 42, points: [] }) };
};

const mod = await import("../lib/client/profile-points.ts");
const { fetchProfilePoints, invalidateProfilePoints } = mod;

// 1. Empty id short-circuits without a request.
calls = 0;
assert.equal(await fetchProfilePoints(""), null);
assert.equal(calls, 0, "empty id must not fetch");

// 2. Concurrent callers share ONE request (the whole point of the module).
calls = 0;
const [a, b, c] = await Promise.all([
  fetchProfilePoints("u1"),
  fetchProfilePoints("u1"),
  fetchProfilePoints("u1"),
]);
assert.equal(calls, 1, `concurrent dedup failed: ${calls} requests`);
assert.equal(a.totalPoints, 42);
assert.equal(a, b);
assert.equal(b, c);

// 3. A later call is served from cache (no new request).
calls = 0;
const d = await fetchProfilePoints("u1");
assert.equal(calls, 0, "cached call must not refetch");
assert.equal(d.totalPoints, 42);

// 4. Different ids are cached independently.
calls = 0;
await fetchProfilePoints("u2");
assert.equal(calls, 1, "different id must fetch");

// 5. invalidate(one) forces a refetch for that id only.
calls = 0;
invalidateProfilePoints("u1");
await fetchProfilePoints("u1");
assert.equal(calls, 1, "invalidated id must refetch");

calls = 0;
await fetchProfilePoints("u2");
assert.equal(calls, 0, "non-invalidated id must stay cached");

// 6. A failed request resolves null, does not cache, and retries next time.
failNext = true;
calls = 0;
invalidateProfilePoints("u3");
const failed = await fetchProfilePoints("u3");
assert.equal(failed, null, "failure must resolve null");
assert.equal(calls, 1);
const retried = await fetchProfilePoints("u3");
assert.equal(calls, 2, "failure must not be cached");
assert.equal(retried.totalPoints, 42);

// 7. invalidate() with no arg clears everything.
invalidateProfilePoints();
calls = 0;
await fetchProfilePoints("u1");
await fetchProfilePoints("u2");
assert.equal(calls, 2, "clear-all must drop every entry");

console.log("profile-points cache: all 7 checks passed");
