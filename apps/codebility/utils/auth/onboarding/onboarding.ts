import type { Pos, CornerIndex } from "@/types/auth/onboarding/onboarding";

/** Seeded RNG so positions/timings are stable */
export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function placeAwayFromCenter(rand: () => number): Pos {
  let top = rand() * 90 + 5;
  let left = rand() * 90 + 5;

  const inCenter = top > 30 && top < 70 && left > 30 && left < 70;
  if (inCenter) {
    const cornerIndex = Math.min(
      3,
      Math.max(0, Math.floor(rand() * 4)),
    ) as CornerIndex;

    // Tuple of exactly 4 positions
    const ranges: readonly [Pos, Pos, Pos, Pos] = [
      { top: rand() * 25 + 5, left: rand() * 25 + 5 }, // TL
      { top: rand() * 25 + 5, left: rand() * 25 + 75 }, // TR
      { top: rand() * 25 + 75, left: rand() * 25 + 5 }, // BL
      { top: rand() * 25 + 75, left: rand() * 25 + 75 }, // BR
    ] as const;

    const chosen: Pos = ranges[cornerIndex]; // always defined with tuple indexing
    top = chosen.top;
    left = chosen.left;
  }

  return { top, left };
}
