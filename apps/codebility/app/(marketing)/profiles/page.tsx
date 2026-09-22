import { Metadata } from "next";

import Section from "../_shared/CodevsSection";
import { CodevHireCodevModal } from "./_components/CodevHireCodevModal";
import { ProfilesListBlock } from "./_components/ProfilesListBlock";

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

export default function Profiles() {
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
                <ProfilesListBlock />
            </Section>
            <CodevHireCodevModal />
        </>
    );
}
