import { Suspense } from "react";
import type { Metadata } from "next";

import Paragraph from "@/components/global/typography/Paragraph";
import Logo from "@/components/global/layout/Logo";
import { getCachedProfileDetailMeta } from "@/lib/marketing/profiles/profile-detail-cached";

import ProfileCloseButton from "@/components/marketing/profiles/ProfileDetailCloseButton";
import { ProfileDetailSection } from "@/components/marketing/profiles/ProfileDetailSection";
import { ProfileDetailSkeleton } from "@/components/marketing/profiles/ProfileDetailSkeleton";
import type { ProfilesIdPageProps } from "@/types/marketing/profiles/profiles";

export async function generateMetadata({ params }: ProfilesIdPageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await getCachedProfileDetailMeta(id);

  if (!profile) {
    return {
      title: "Developer Profile | Codebility",
      description: "View this developer's profile on Codebility.",
    };
  }

  const name = `${profile.first_name} ${profile.last_name}`.trim();
  const image = profile.image_url ?? "/og-image.jpg";

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

export default function CodevBioPage(props: ProfilesIdPageProps) {
  return (
    <section className="from-black-500 to-black-100 relative flex min-h-screen flex-col bg-gradient-to-l">
      <div className="bg-section-wrapper absolute inset-0 bg-fixed bg-repeat opacity-20"></div>
      <div className="relative flex-grow px-5 py-5 md:px-10 md:py-10 lg:px-32 lg:py-20">
        <div className="float-end">
          <ProfileCloseButton />
        </div>
        <Suspense fallback={<ProfileDetailSkeleton />}>
          <ProfileDetailSection params={props.params} />
        </Suspense>
      </div>
      <div className="relative flex flex-col items-center gap-4 pb-10">
        <Logo />
        <Paragraph>© 2023 Codebility. All Rights Reserved</Paragraph>
      </div>
    </section>
  );
}
