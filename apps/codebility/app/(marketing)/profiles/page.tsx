import { Suspense } from "react";
import { UsersSkeleton } from "@/components/ui/skeleton/UsersSkeleton";
import { getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";
import { prioritizeCodevs } from "@/utils/codev-priority"; // ← CHANGED: Only import prioritizeCodevs
import { getQualifiedCodevs } from "@/utils/codev-qualification";

import Section from "../_shared/CodevsSection";
import CodevContainer from "./_components/CodevContainer";
import { CodevHireCodevModal } from "./_components/CodevHireCodevModal";
import CodevList from "./_components/CodevList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Profiles() {
  // Fetch all passed codevs (includes admins, mentors, codevs)
  const [{ data: allCodevs, error }] = await Promise.all([
    getCodevs({ filters: { application_status: "passed" } }),
  ]);

  if (error) {
    throw new Error("Failed to fetch profiles data");
  }

  // Convert to array safely
  const codevsArray: Codev[] = Array.isArray(allCodevs) ? allCodevs : [];

  // ✅ STEP 1: Filter by qualification criteria (100+ points, TRAINING/GRADUATED/NULL, available)
  // This handles ALL filtering logic - no need for additional filters
  const qualifiedCodevs = getQualifiedCodevs(codevsArray);

  // ✅ STEP 2: Apply priority sorting only (no additional filtering)
  // We already filtered everything in getQualifiedCodevs(), so just prioritize by:
  // - Active projects > No projects
  // - Available > Unavailable
  const sortedCodevs = prioritizeCodevs(qualifiedCodevs); // ← CHANGED: Direct prioritization

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("📊 PROFILES PAGE STATS:");
    console.log(`   Total codevs fetched: ${codevsArray.length}`);
    console.log(`   Qualified codevs: ${qualifiedCodevs.length}`);
    console.log(`   Final displayed: ${sortedCodevs.length}`);
  }

  return (
    <>
      <Section
        id="codevs"
        className="relative w-full bg-gradient-to-b from-slate-900 to-slate-950 min-h-screen"
      >
        <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
        {/* Glassmorphism background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-customBlue-950/20 to-purple-950/20" />
        <div className="absolute -top-4 -right-4 h-96 w-96 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 blur-3xl" />
        <div className="absolute -bottom-4 -left-4 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-8 z-10">
          <CodevContainer />
          <Suspense fallback={<UsersSkeleton />}>
            <CodevList codevs={sortedCodevs} />
          </Suspense>
        </div>
      </Section>
      <CodevHireCodevModal />
    </>
  );
}