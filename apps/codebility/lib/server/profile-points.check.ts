/**
 * Self-check for the profile-points scoring extracted out of
 * app/api/profile-points/[codevId]/route.ts. Run it with:
 *
 *   npx tsx lib/server/profile-points.check.ts
 */
import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";

import { computeProfilePoints, MAX_PROFILE_POINTS } from "./profile-points";

type Fixture = {
  codev: Record<string, unknown>;
  workExperience: unknown[];
  education: unknown[];
};

/** Minimal stand-in for the three queries computeProfilePoints issues. */
function stubSupabase(fixture: Fixture): SupabaseClient {
  const rowsFor = (table: string) =>
    table === "work_experience" ? fixture.workExperience : fixture.education;

  return {
    from(table: string) {
      return {
        select() {
          return {
            eq() {
              return {
                single: async () => ({ data: fixture.codev, error: null }),
                then: (resolve: (value: unknown) => unknown) =>
                  resolve({ data: rowsFor(table), error: null }),
              };
            },
          };
        },
      };
    },
  } as unknown as SupabaseClient;
}

async function run() {
  assert.equal(MAX_PROFILE_POINTS, 127, "max points changed unexpectedly");

  // One-time fields: 5 + 3 + 2 + 5 + 2 + 5 = 22.
  // Arrays: tech 3*2 + work 2*8 + education 1*6 + positions 2*3 = 34.
  const filled = await computeProfilePoints(
    stubSupabase({
      codev: {
        id: "u1",
        image_url: "https://example.test/a.png",
        about: "x".repeat(50),
        phone_number: "+63 900 000 0000",
        address: "   ",
        github: "https://github.test/a",
        linkedin: null,
        facebook: "",
        discord: null,
        portfolio_website: "https://a.test",
        tech_stacks: ["ts", "react", "sql"],
        positions: ["dev", "lead"],
        years_of_experience: 4,
      },
      workExperience: [{ id: "w1" }, { id: "w2" }],
      education: [{ id: "e1" }],
    }),
    "u1",
  );

  assert.ok(filled, "expected a result");
  assert.equal(filled.totalPoints, 56);
  assert.equal(filled.completionPercentage, Math.round((56 / 127) * 100));
  assert.equal(filled.completionDetails.image_url?.completed, true);
  assert.equal(filled.completionDetails.address?.completed, false);
  assert.equal(filled.completionDetails.linkedin?.completed, false);
  assert.equal(filled.completionDetails.education?.points, 6);
  assert.equal(filled.dataCounts.workExperiences, 2);

  // `about` under the 50-character minimum scores nothing.
  assert.equal(
    filled.breakdown.find((entry) => entry.category === "about")?.points,
    3,
  );

  // Array rules cap on both item count and total points.
  const capped = await computeProfilePoints(
    stubSupabase({
      codev: {
        id: "u2",
        about: "too short",
        tech_stacks: Array.from({ length: 12 }, (_, i) => `t${i}`),
        positions: [],
      },
      workExperience: Array.from({ length: 7 }, (_, i) => ({ id: `w${i}` })),
      education: [],
    }),
    "u2",
  );

  assert.ok(capped, "expected a result");
  assert.equal(capped.completionDetails.tech_stacks?.points, 20);
  assert.equal(capped.completionDetails.work_experience?.points, 40);
  assert.equal(capped.completionDetails.about?.completed, false);
  assert.equal(capped.totalPoints, 60);

  // A missing profile is reported as null rather than a zero score.
  const missing = await computeProfilePoints(
    {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: { message: "no row" } }),
            then: (resolve: (value: unknown) => unknown) =>
              resolve({ data: [], error: null }),
          }),
        }),
      }),
    } as unknown as SupabaseClient,
    "missing",
  );

  assert.equal(missing, null);

  console.log("profile-points: all checks passed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
