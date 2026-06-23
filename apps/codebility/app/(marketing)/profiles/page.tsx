import { Metadata } from "next";
import { Suspense } from "react";
import { UsersSkeleton } from "@/components/ui/skeleton/UsersSkeleton";
import { getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";
import { prioritizeCodevs } from "@/utils/codev-priority";
import { getQualifiedCodevs } from "@/utils/codev-qualification";

import Section from "../_shared/CodevsSection";
import CodevContainer from "./_components/CodevContainer";
import { CodevHireCodevModal } from "./_components/CodevHireCodevModal";
import CodevList from "./_components/CodevList";

export const metadata: Metadata = {
    title: "Developer Profiles — Browse Our Talent Pool | Codebility",
    description: "Browse vetted Filipino software developer profiles on Codebility. Filter by skill, availability, and expertise to find your perfect hire.",
    alternates: { canonical: "https://www.codebility.tech/profiles" },
    openGraph: {
        title: "Developer Profiles | Codebility",
        description: "Browse vetted Filipino software developer profiles and find your next hire.",
        url: "https://www.codebility.tech/profiles",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Codebility Developer Profiles" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Developer Profiles | Codebility",
        description: "Browse vetted Filipino software developer profiles and find your next hire.",
        images: ["/og-image.jpg"],
    },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Profiles() {
    const [{ data: allCodevs, error }] = await Promise.all([
        getCodevs({ filters: { application_status: "passed" } }),
    ]);

    if (error) {
        throw new Error("Failed to fetch profiles data");
    }

    const codevsArray: Codev[] = Array.isArray(allCodevs) ? allCodevs : [];
    const qualifiedCodevs = getQualifiedCodevs(codevsArray);
    const sortedCodevs = prioritizeCodevs(qualifiedCodevs);

    return (
        <>
            <Section
                id="codevs"
                className="relative w-full bg-gradient-to-b from-slate-900 to-slate-950 min-h-screen"
            >
                <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
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