import type { Codev } from "@/types/global/codev";
import type { CodevsProfilesPage } from "@/types/global/codevs-profiles";
import { EmblaOptionsType } from "embla-carousel";
import { ComponentPropsWithRef, ReactNode } from "react";

export interface CodevCardProps {
  codev: Codev;
  color: string;
  animateEntrance?: boolean;
}

export interface CodevListFilterProps {
  selectedPosition: string;
  setSelectedPosition: (position: string) => void;
  users: Codev[];
  positions?: string[];
}

export type PropType = {
  slides: string[];
  options: EmblaOptionsType;
};

export type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export type PrevButtonPropType = ComponentPropsWithRef<"button">;

export interface FeaturedCardProps {
  title: string;
  description: string;
  url?: string; // Optional, defaults to "#"
  src: string;
  alt: string;
}

export type CodevsFeaturedProjectsAnimatedProps = {
  slides: string[];
  options: EmblaOptionsType;
};

export interface CodevsProfilesPaginationProps {
  initialData: CodevsProfilesPage;
  pageSize: number;
}

export interface SectionProps {
  children: ReactNode;
  className?: string; // Optional className prop
  id?: string; // Optional id prop
}

export type MarketingProgressiveSectionProps = {
  children: ReactNode;
  skeleton: ReactNode;
  className?: string;
};

export type ProgressiveMotionProps = {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  amount?: number | "some" | "all";
  staggerChildren?: number;
  /** Play enter animation immediately on mount (paginated lists). */
  playOnMount?: boolean;
};
