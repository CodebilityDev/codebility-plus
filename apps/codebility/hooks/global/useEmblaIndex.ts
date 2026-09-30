"use client";

import { useEffect, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";

export function useEmblaIndex(emblaApi: EmblaCarouselType | undefined) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi]);

  return index;
}
