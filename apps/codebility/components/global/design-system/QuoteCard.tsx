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
        "flex flex-col gap-4 rounded-3xl border border-purple-300/30 bg-[#121214] p-6 shadow-[0_0_48px_rgba(151,71,255,0.18)]",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar
          initials={initials}
          src={avatarSrc}
          alt={name}
          size={40}
          gradient={avatarGradient}
        />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
            {name}
          </p>
          <p className="text-sm text-white/50">{role}</p>
        </div>
      </div>
      <blockquote className="text-lg leading-7 text-white/75">
        {quote}
      </blockquote>
      <div className="flex items-center gap-4">
        <Rating value={rating} />
        {page && pageCount ? (
          <div aria-hidden className="ml-auto flex items-center gap-1.5">
            {Array.from({ length: pageCount }, (_, index) => (
              <span
                key={index}
                className={cn(
                  "h-2 rounded-full",
                  index === page - 1 ? "w-6 bg-[#9747ff]" : "w-2 bg-white/25",
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
