"use client";

import { Button } from "@/components/global/ui/button";
import LandingImage from "@/components/marketing/LandingImage";
import { WorkWithUsWORK_WITH_US_CARDS } from "@/constants/marketing/marketing";
import Link from "next/link";

export const WorkWithUsCard = ({
  card,
  index,
}: {
  card: (typeof WorkWithUsWORK_WITH_US_CARDS)[number];
  index: number;
}) => (
  <div data-progressive-child className="group relative w-full">
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/60 via-purple-400/40 to-purple-900/20 opacity-80 blur-2xl transition-all duration-500 group-hover:opacity-100" />
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 bg-gradient-to-br from-white/10 via-white/5 to-purple-950/20 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-300/60 hover:shadow-purple-500/20 md:p-8">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative aspect-[16/9] w-full">
          <LandingImage
            src={card.image.src}
            alt={card.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-950/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-6 text-white md:mt-10">
        <h3 className="text-2xl font-semibold md:text-3xl">{card.title}</h3>
        <p className="text-base leading-relaxed text-white/75 md:text-lg">
          {card.description}
        </p>
        <div className="pt-2">
          <Link href={card.link.href} className="inline-block">
            <Button
              variant="purple"
              size="lg"
              rounded="full"
              className="shadow-lg shadow-purple-500/20"
            >
              {card.link.text}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);
