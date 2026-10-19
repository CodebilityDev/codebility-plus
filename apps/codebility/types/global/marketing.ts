import type { Codev, CodevBadgeSkillCategory } from "@/types/global/codev";
import type { CodevsProfilesPage } from "@/types/global/codevs-profiles";
import type { EmblaOptionsType } from "embla-carousel";
import type { ComponentPropsWithRef, ReactNode } from "react";
import type React from "react";


export interface CodevCardProps {
  codev: Codev;
  color: string;
  animateEntrance?: boolean;
  skillCategories: CodevBadgeSkillCategory[];
}

export interface CodevListFilterProps {
  selectedPosition: string;
  setSelectedPosition: (position: string) => void;
  users: Codev[];
  positions?: string[];
}

export interface PropType {
  slides: string[];
  options: EmblaOptionsType;
}

export interface UsePrevNextButtonsType {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
}

export type PrevButtonPropType = ComponentPropsWithRef<"button">;

export interface FeaturedCardProps {
  title: string;
  description: string;
  url?: string;
  src: string;
  alt: string;
}

export interface CodevsFeaturedProjectsAnimatedProps {
  slides: string[];
  options: EmblaOptionsType;
}

export interface CodevsProfilesProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export interface CodevsProfilesPaginationProps {
  initialData: CodevsProfilesPage;
  pageSize: number;
  skillCategories: CodevBadgeSkillCategory[];
}

export interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export interface MarketingProgressiveSectionProps {
  children: ReactNode;
  skeleton: ReactNode;
  className?: string;
}

export interface ProgressiveMotionProps {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  amount?: number | "some" | "all";
  staggerChildren?: number;
  playOnMount?: boolean;
}

export interface CodevsGridProps {
  codevs: CodevsProfilesPage["codevs"];
  page: number;
  skillCategories: CodevBadgeSkillCategory[];
}

export interface CodevsPaginationSlotProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface CodevsProfilesSkeletonProps { count?: number }

export interface CodevsProfilesFilterProps {
  positions: string[];
  selectedPosition: string;
  onSelect?: (position: string) => void;
}

export interface CodevsProfilesFallbackProps {
  positions: string[];
}

export interface JsonLdProps { data: Record<string, unknown> }

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export interface DrawerAuthSectionProps {handleLogout: () => void}

export interface UserMenuProps {handleLogout: () => void}

export interface MobileDrawerProps {
  openSheet: boolean;
  setOpenSheet: (open: boolean) => void;
  drawerAuth?: React.ReactNode;
}