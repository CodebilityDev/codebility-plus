import type { Metadata } from "next";

import { LandingCommunity } from "@/components/global/marketing/LandingCommunity";
import { CodevsAbout } from "@/components/landing/codevs/CodevsAbout";
import { CodevsCommunity } from "@/components/landing/codevs/CodevsCommunity";
import { CodevsFaq } from "@/components/landing/codevs/CodevsFaq";
import { CodevsHero } from "@/components/landing/codevs/CodevsHero";
import { CodevsRoadmap } from "@/components/landing/codevs/CodevsRoadmap";
import { CodevsWhyJoin } from "@/components/landing/codevs/CodevsWhyJoin";
import { getCachedCodevsCommunity } from "@/lib/landing/codevs/community";

export const metadata: Metadata = {
  title: "Be a CoDev — Build Your Skills on Real Projects",
  description:
    "Join Codebility as a CoDev. Developers, UI/UX designers and QA grow together on real projects, guided by mentors, and launch international careers.",
  alternates: { canonical: "https://www.codebility.tech/codevs" },
  openGraph: {
    title: "Be a CoDev | Codebility",
    description:
      "Build your skills on real projects with a community of developers, designers and QA.",
    url: "https://www.codebility.tech/codevs",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Codebility CoDevs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Be a CoDev | Codebility",
    description:
      "Build your skills on real projects with a community of developers, designers and QA.",
    images: ["/og-image.jpg"],
  },
};

export default async function CodevsPage() {
  const community = await getCachedCodevsCommunity();
  const withPhotos = community.members.filter((member) => member.imageSrc);

  return (
    <>
      <CodevsHero members={withPhotos} total={community.total} />
      <CodevsWhyJoin />
      <CodevsRoadmap />
      <CodevsCommunity members={community.members} total={community.total} />
      <CodevsAbout />
      <CodevsFaq />
      <LandingCommunity
        codevs={withPhotos}
        total={community.total}
        eyebrow="START TODAY"
        description="Sign up, complete onboarding and get matched to your first project."
        secondaryAction={{ label: "Read the house rules", href: "#faq" }}
        floating={false}
        primaryArrow
        className="lg:pb-[var(--cb-space-64)]"
      />
    </>
  );
}
