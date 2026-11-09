import { cn } from "@codevs/ui";

import { Avatar } from "@/components/global/design-system/Avatar";
import type { AvatarGradient } from "@/components/global/design-system/Avatar";
import { Rating } from "@/components/global/design-system/Rating";

export interface QuoteCardProps {
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarGradient?: AvatarGradient;
  avatarSrc?: string;
  rating?: number;
  page?: number;
  pageCount?: number;
  className?: string;
}

function QuoteCard({
  quote,
  name,
  role,
  initials,
  avatarGradient,
  avatarSrc,
  rating = 5,
  page,
  pageCount,
  className,
}: QuoteCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-[var(--cb-space-16)] rounded-[var(--cb-radius-24)] border border-[color:var(--cb-pill-border)] bg-[color:var(--cb-surface-2)] p-[var(--cb-space-24)] shadow-[0_0_48px_var(--cb-primary-subtle)]",
        className,
      )}
    >
      <div className="flex items-center gap-[var(--cb-space-12)]">
        <Avatar
          initials={initials}
          src={avatarSrc}
          alt={name}
          size={40}
          gradient={avatarGradient}
        />
        <div className="flex min-w-0 flex-col gap-[var(--cb-space-2)]">
          <p className="text-[17px] font-semibold leading-6 text-[color:var(--cb-text)]">
            {name}
          </p>
          <p className="text-sm text-[color:var(--cb-text-muted)]">{role}</p>
        </div>
      </div>
      <blockquote className="text-lg leading-7 text-[color:var(--cb-text-secondary)]">
        {quote}
      </blockquote>
      <div className="flex items-center gap-[var(--cb-space-16)]">
        <Rating value={rating} />
        {page && pageCount ? (
          <div aria-hidden className="ml-auto flex items-center gap-[var(--cb-space-6)]">
            {Array.from({ length: pageCount }, (_, index) => (
              <span
                key={index}
                className={cn(
                  "h-[var(--cb-size-8)] rounded-[var(--cb-radius-full)]",
                  index === page - 1 ? "w-[var(--cb-size-24)] bg-[color:var(--cb-primary)]" : "w-[var(--cb-size-8)] bg-[color:color-mix(in_srgb,var(--cb-white)_25%,transparent)]",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { QuoteCard };
