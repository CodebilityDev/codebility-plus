import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

import type { HireTalentProfile } from "@/types/landing/hire-a-codev/profile";

export function HireTalentCard({ profile }: { profile: HireTalentProfile }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[#0B0B0D] transition-colors hover:border-[color:color-mix(in_srgb,var(--cb-primary)_45%,transparent)]">
      <div className="relative aspect-square w-full overflow-hidden border-b border-[color:var(--cb-border)] bg-[#151515]">
        {profile.imageSrc ? (
          <Image
            src={profile.imageSrc}
            alt={profile.name}
            fill
            loading="lazy"
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--cb-surface-2)] to-[var(--cb-surface)] text-4xl font-semibold text-[color:var(--cb-text-muted)]">
            {profile.initials}
          </div>
        )}
        {profile.available ? (
          <span className="absolute left-[var(--cb-space-12)] top-[var(--cb-space-12)] inline-flex h-[var(--cb-size-24)] items-center gap-[var(--cb-space-6)] rounded-[var(--cb-radius-full)] border border-[color:color-mix(in_srgb,var(--cb-success)_35%,transparent)] bg-[#08130D]/80 px-[10px] text-[10px] font-medium leading-4 text-[color:var(--cb-text-secondary)] backdrop-blur">
            <span
              aria-hidden
              className="h-[var(--cb-size-6)] w-[var(--cb-size-6)] rounded-[var(--cb-radius-full)] bg-[color:var(--cb-success)]"
            />
            Available
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-[var(--cb-space-12)]">
        <div className="flex items-center gap-[var(--cb-space-6)]">
          <h3 className="truncate text-[15px] font-semibold leading-5 text-[color:var(--cb-text)]">
            {profile.name}
          </h3>
          <BadgeCheck
            aria-label="Verified developer"
            className="h-[var(--cb-size-14)] w-[var(--cb-size-14)] shrink-0 text-[color:var(--cb-text-secondary)]"
          />
        </div>
        <p className="mt-[var(--cb-space-2)] truncate text-xs leading-[18px] text-[color:var(--cb-text-muted)]">
          {profile.role}
        </p>

        {profile.levels.length > 0 ? (
          <div className="mt-[var(--cb-space-12)] flex flex-wrap gap-[var(--cb-space-6)]">
            {profile.levels.map((level, index) => (
              <span
                key={level.id}
                className={
                  "inline-flex h-[var(--cb-size-24)] items-center rounded-[6px] border px-[var(--cb-space-8)] text-[10px] font-medium leading-4 " +
                  (index === 0
                    ? "border-[color:color-mix(in_srgb,var(--cb-primary)_50%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_20%,transparent)] text-[color:var(--cb-p200)]"
                    : "border-[color:color-mix(in_srgb,#F59E0B_35%,transparent)] bg-[color:color-mix(in_srgb,#F59E0B_12%,transparent)] text-[#F5C26B]")
                }
              >
                {level.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <Link
        href={"/profiles/" + profile.id}
        className="mt-auto flex h-[var(--cb-size-44)] items-center justify-between border-t border-[color:var(--cb-border)] px-[var(--cb-space-12)] text-sm text-[color:var(--cb-p300)] transition-colors hover:bg-[color:var(--cb-panel)] hover:text-[color:var(--cb-p200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--cb-ring)]"
      >
        View profile
        <ArrowRight
          aria-hidden
          className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
        />
      </Link>
    </article>
  );
}
