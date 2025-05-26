"use server";

import { Suspense } from "react";
import { UsersSkeleton } from "@/Components/ui/skeleton/UsersSkeleton";
import { getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";
import { prioritizeCodevs } from "@/utils/codev-priority"; // Import the utility

import Section from "../codevs/_components/CodevsSection";
import CodevContainer from "./_components/CodevContainer";
import CodevList from "./_components/CodevList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Profiles() {
  const [{ data: allCodevs, error }] = await Promise.all([
    getCodevs({ filters: { role_id: 4 } }),
  ]);

  if (error) {
    throw new Error("Failed to fetch profiles data");
  }

  const codevsArray: Codev[] = Array.isArray(allCodevs) ? allCodevs : [];

  // Use the utility function with filterAdminAndFailed set to true
  const sortedCodevs = prioritizeCodevs(codevsArray, true);

  return (
    <Section
      id="codevs"
      className="from-black-500 relative w-full bg-gradient-to-b"
    >
      <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
      <div className="relative flex flex-col gap-8">
        <CodevContainer />
        <Suspense fallback={<UsersSkeleton />}>
          <CodevList codevs={sortedCodevs} />
        </Suspense>
      </div>
    </Section>
  );
}
