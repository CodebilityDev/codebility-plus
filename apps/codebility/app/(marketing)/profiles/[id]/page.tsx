import { Metadata } from "next";
import React from "react";
import { Paragraph } from "@/components/shared/home";
import Logo from "@/components/shared/Logo";
import { getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";

import ProfileCloseButton from "./_components/ProfileCloseButton";
import ProfileContent from "./_components/ProfileContent";

interface Props {
    params: Promise<{ id: string }>;
}

// Generates a unique title/description for each individual profile page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const { data, error } = await getCodevs({ filters: { id } });

    // Fallback metadata if fetch fails or codev not found
    if (error || !data || data.length === 0) {
        return {
            title: "Developer Profile | Codebility",
            description: "View this developer's profile on Codebility.",
        };
    }

    const codev = data[0] as Codev;
    const name = `${codev.first_name} ${codev.last_name}`;
    const image = codev.image_url || "/og-image.jpg";

    return {
        title: `${name} — Developer Profile | Codebility`,
        description: `View ${name}'s developer profile on Codebility. Skills, availability, and portfolio.`,
        alternates: {
            canonical: `https://www.codebility.tech/profiles/${id}`,
        },
        openGraph: {
            title: `${name} | Codebility`,
            description: `View ${name}'s developer profile on Codebility.`,
            url: `https://www.codebility.tech/profiles/${id}`,
            images: [{ url: image, width: 400, height: 400, alt: name }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${name} | Codebility`,
            description: `View ${name}'s developer profile on Codebility.`,
            images: [image],
        },
    };
}

export default async function CodevBioPage(props: Props) {
    const params = await props.params;
    const id = params.id;

    const { data, error } = await getCodevs({ filters: { id } });

    if (error) {
        console.error("Failed to fetch Codev data:", error);
        return <div>ERROR: Failed to fetch Codev data. {error.message}</div>;
    }

    if (!data || data.length === 0) {
        return <div>No profiles found.</div>;
    }

    const codev = data[0] as Codev;
    const availableSchedule = codev.work_schedules ? codev.work_schedules[0] : null;

    return (
        <section className="from-black-500 to-black-100 relative flex min-h-screen flex-col bg-gradient-to-l">
            <div className="bg-section-wrapper absolute inset-0 bg-fixed bg-repeat opacity-20"></div>
            <div className="relative flex-grow px-5 py-5 md:px-10 md:py-10 lg:px-32 lg:py-20">
                <div className="flex justify-between gap-2">
                    <Logo />
                    <ProfileCloseButton />
                </div>
                <ProfileContent
                    codev={codev}
                    availableSchedule={availableSchedule}
                />
            </div>
            <div className="relative flex flex-col items-center gap-4 pb-10">
                <Logo />
                <Paragraph>© 2023 Codebility. All Rights Reserved</Paragraph>
            </div>
        </section>
    );
}