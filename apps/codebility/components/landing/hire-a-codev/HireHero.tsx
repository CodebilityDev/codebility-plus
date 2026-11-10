import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";

import { Skeleton } from "@codevs/ui/skeleton";

import { Avatar } from "@/components/global/design-system/Avatar";
import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { Rating } from "@/components/global/design-system/Rating";
import { HireContainer } from "@/components/landing/hire-a-codev/HireContainer";
import { getCachedHireTalentProfiles } from "@/lib/landing/hire-a-codev/data";

function HireHeroSocialSkeleton() {
  return (
    <div
      aria-hidden
      className="mt-[var(--cb-space-24)] flex flex-wrap items-center justify-center gap-[var(--cb-space-12)]"
    >
      <div className="flex -space-x-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-[var(--cb-size-32)] w-[var(--cb-size-32)] rounded-[var(--cb-radius-full)] ring-2 ring-[color:var(--cb-bg)]"
          />
        ))}
      </div>
      <Skeleton className="h-4 w-40 rounded-[4px]" />
    </div>
  );
}

async function HireHeroSocialProof() {
  const profiles = await getCachedHireTalentProfiles();

  return (
    <div className="mt-[var(--cb-space-24)] flex flex-wrap items-center justify-center gap-[var(--cb-space-12)]">
      <div className="flex -space-x-2">
        {profiles.slice(0, 4).map((profile) => (
          <Avatar
            key={profile.id}
            initials={profile.initials}
            src={profile.imageSrc}
            alt={profile.name}
            size={32}
            className="rounded-[var(--cb-radius-full)] ring-2 ring-[color:var(--cb-bg)]"
          />
        ))}
      </div>
      <div className="flex items-center gap-[var(--cb-space-8)]">
        <Rating value={5} />
        <span className="text-sm font-semibold leading-5 text-[color:var(--cb-text)]">
          4.9/5
        </span>
        <span className="text-sm leading-5 text-[color:var(--cb-text-muted)]">
          from client engagements
        </span>
      </div>
    </div>
  );
}

export function HireHero() {
  return (
    <section id="top" className="relative overflow-hidden pb-[var(--cb-space-64)] pt-[var(--cb-space-64)] sm:pt-[var(--cb-space-80)] lg:pb-[var(--cb-space-72)] lg:pt-[var(--cb-space-96)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-22rem] h-[58rem] w-[96rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_36%,transparent)_0%,color-mix(in_srgb,var(--cb-primary)_22%,transparent)_40%,color-mix(in_srgb,var(--cb-primary)_8%,transparent)_60%,transparent_82%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[color:var(--cb-bg)] to-transparent" />
      </div>

      <HireContainer className="relative flex flex-col items-center">
        <Eyebrow
          variant="outline"
          className="px-[var(--cb-space-20)] tracking-[0.14em]"
        >
          HIRE CODEVS
        </Eyebrow>

        <h1 className="mt-[var(--cb-space-28)] max-w-[1100px] text-balance text-center text-[44px] font-semibold leading-[1.04] tracking-[-0.045em] text-[color:var(--cb-text)] sm:text-[62px] lg:text-[80px]">
          Add vetted developers{" "}
          <span className="block">
            to your team,{" "}
            <span className="cb-community-text">fast</span>
          </span>
        </h1>

        <p className="mx-auto mt-[var(--cb-space-20)] max-w-[680px] text-center text-base leading-7 text-[color:var(--cb-text-muted)] sm:text-lg">
          Skilled Filipino engineers, designers and QA who join your roadmap.
          You interview them first, and we support them the whole way.
        </p>

        <div className="mt-[var(--cb-space-32)] flex flex-wrap items-center justify-center gap-[var(--cb-space-12)]">
          <Button
            asChild
            className="shadow-[0_0_32px_color-mix(in_srgb,var(--cb-primary)_35%,transparent)]"
          >
            <Link href="/bookacall">
              Book a Call
              <ArrowRight
                aria-hidden
                className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
              />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="#talent">See available talent</Link>
          </Button>
        </div>

        <Suspense fallback={<HireHeroSocialSkeleton />}>
          <HireHeroSocialProof />
        </Suspense>

        <p className="mt-[var(--cb-space-56)] text-[11px] font-semibold uppercase leading-4 tracking-[0.22em] text-[color:var(--cb-text-muted)] sm:mt-[var(--cb-space-72)]">
          Trusted by teams at
        </p>
      </HireContainer>
    </section>
  );
}
