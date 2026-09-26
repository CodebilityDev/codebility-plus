import type React from "react";
import type { RefObject } from "react";

export interface AboutSlidesProps {
  slidesRef: RefObject<HTMLDivElement | null>;
}

export type Bubble = {
  id: string;
  size: number; // px
  topPct: number;
  leftPct: number;
  hue: number; // 0..360
  depth: number; // parallax multiplier
  floatDur: number; // s
  delay: number; // s
};

export type Pos = { top: number; left: number };

export type CornerIndex = 0 | 1 | 2 | 3;

export interface HeroSectionProps {
  h1Ref: RefObject<HTMLHeadingElement | null>;
}

export type HouseRulesSectionProps = React.HTMLAttributes<HTMLElement>;

export type IsRoadMapProps = React.HTMLAttributes<HTMLDivElement>;

export type Partner = { id: string; src: string; alt: string };

export type StickyLogoProps = {
  logoRef: RefObject<HTMLDivElement | null>;
  isVisible: boolean;
};

// -------------------------
// Types
// -------------------------
export type Person = {
  name: string;
  role: string;
  image?: string;
};

export type WellcomeSectionWrapperProps = React.HTMLAttributes<HTMLDivElement>;

/** Keep this typing exactly as agreed */
export interface UseOnboardingAnimationsProps {
  heroRef: RefObject<HTMLDivElement | null>;
  logoRef: RefObject<HTMLDivElement | null>;
  aboutRef: RefObject<HTMLDivElement | null>;
  slidesRef: RefObject<HTMLDivElement | null>;
  regularRef: RefObject<HTMLDivElement | null>;
  h1Ref: RefObject<HTMLHeadingElement | null>;
  roadmapRef?: RefObject<HTMLDivElement | null>;
  setIsLogoVisible: (visible: boolean) => void;
}

// -------------------------
// PersonCard
// -------------------------
export interface PersonCardProps { person: Person }

export interface RoadMapWrapperProps {
  roadmapRef: RefObject<HTMLDivElement>;
}

// -------------------------
// Avatar
// -------------------------
export interface TeamSectionAvatarProps {
  person: Person;
  size?: number;
  position?: string;
}
