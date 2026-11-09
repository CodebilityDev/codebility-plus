import { HeroDeveloperCard } from "@/components/landing/HeroDeveloperCard";
import type { HeroCodev } from "@/types/landing/hero-codevs";

interface HeroMarqueeProps {
  codevs: HeroCodev[];
}

function HeroMarquee({ codevs }: HeroMarqueeProps) {
  if (codevs.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Featured CoDevs"
      className="cb-marquee-mask relative left-1/2 w-screen -translate-x-1/2 overflow-hidden"
    >
      <div className="cb-marquee flex w-max">
        {[0, 1].map((group) => (
          <div
            key={group}
            aria-hidden={group === 1}
            className="flex shrink-0 gap-[var(--cb-space-24)] pr-[var(--cb-space-24)]"
          >
            {codevs.map((codev) => (
              <div
                key={`${group}-${codev.id}`}
                className="w-[294px] shrink-0"
              >
                <HeroDeveloperCard codev={codev} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export { HeroMarquee };
