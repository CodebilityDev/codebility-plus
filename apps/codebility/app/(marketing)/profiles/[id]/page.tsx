import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Paragraph } from "@/components/shared/home";
import Logo from "@/components/shared/Logo";
import {
  getCachedProfileDetail,
  getCachedProfileDetailMeta,
} from "@/lib/server/profile-detail-cached";
import {
  getCachedLandingAdminsData,
  getLandingAdminsProfileIds,
} from "@/lib/server/landing-admins-cached";
import { getCachedLandingInternsPage } from "@/lib/server/landing-interns-cached";

import ProfileCloseButton from "./_components/ProfileCloseButton";
import ProfileContent from "./_components/ProfileContent";

interface Props {
  params: Promise<{ id: string }>;
}

const LANDING_PAGE_SIZE = 10;

export async function generateStaticParams() {
  const [landing, adminsData] = await Promise.all([
    getCachedLandingInternsPage(1, LANDING_PAGE_SIZE),
    getCachedLandingAdminsData(),
  ]);

  const ids = new Set<string>();

  for (const member of landing?.TEAM_MEMBERS ?? []) {
    ids.add(member.id);
  }

  if (adminsData) {
    for (const id of getLandingAdminsProfileIds(adminsData)) {
      ids.add(id);
    }
  }

  return [...ids].map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const profile = await getCachedProfileDetailMeta(id);

  if (!profile) {
    return {
      title: "Developer Profile | Codebility",
      description: "View this developer's profile on Codebility.",
    };
  }

  const name = `${profile.first_name} ${profile.last_name}`.trim();
  const image = profile.image_url || "/og-image.jpg";

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
  const { id } = await props.params;
  const codev = await getCachedProfileDetail(id);

  if (!codev) {
    notFound();
  }

  const availableSchedule = codev.work_schedules?.[0] ?? null;

  return (
    <section className="from-black-500 to-black-100 relative flex min-h-screen flex-col bg-gradient-to-l">
      <div className="bg-section-wrapper absolute inset-0 bg-fixed bg-repeat opacity-20"></div>
      <div className="relative flex-grow px-5 py-5 md:px-10 md:py-10 lg:px-32 lg:py-20">
        <div className="float-end">
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
