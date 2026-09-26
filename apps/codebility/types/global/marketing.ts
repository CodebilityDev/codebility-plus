import type { Codev } from "@/types/global/codev";
import type { CodevsProfilesPage } from "@/types/global/codevs-profiles";
import type { EmblaOptionsType } from "embla-carousel";
import type { ComponentPropsWithRef, ReactNode } from "react";
import type React from "react";


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

export interface CodevsGridProps {
  codevs: CodevsProfilesPage["codevs"];
  page: number;
}

export interface CodevsPaginationSlotProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface CodevsProfilesRemoteProps {
  position: string;
  page: number;
  pageSize: number;
  initialData: CodevsProfilesPage;
}

export interface CodevsProfilesGridProps {
  position: string;
  page: number;
  pageSize: number;
  initialData: CodevsProfilesPage;
}

export interface CodevsProfilesSkeletonProps { count?: number }

// CBP-135 follow-up: shared JSON-LD renderer.
// Usage: <JsonLd data={someSchemaObject} />
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
