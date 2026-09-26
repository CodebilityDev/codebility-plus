import type { ROLE_STYLES } from "@/constants/marketing/marketing";
import type { Codev } from "@/types/global/codev";
import type { ReactNode } from "react";
import type { WorkWithUsWORK_WITH_US_CARDS } from "@/constants/marketing/marketing";
import type { LandingInternsPage } from "@/types/global/lib";


export interface AnimatedAdminsSectionProps {
  title: string;
  description: string;
  members: Codev[];
  sectionId: string;
}

export type AnimatedMetricsProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  label?: string;
  format?: "number" | "decimal";
  delay?: number;
  variant?: "hero" | "stat";
};

export interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  speed: number;
  direction: number;
}

export interface FeaturesCardProps {
  imageName: string;
  imageAlt: string;
  title: string;
  description: string;
  index?: number;
}

export interface HeroCardProps {
  title: string;
  description: string;
  url?: string;
  category?: string;
}

export type Person = {
  id: string;
  name: string;
  role: "Intern" | "Codev";
  image?: string;
  display_position?: string;
};

export type RoleStyle = (typeof ROLE_STYLES)[keyof typeof ROLE_STYLES];

export type PersonRole = "Intern" | "Codev";

export type LandingInternMember = {
  id: string;
  name: string;
  role: PersonRole;
  image?: string;
  display_position?: string;
};

export interface AccordionProps {
  title: string;
  children: ReactNode;
}

export interface FooterProps {
  onClose: () => void;
}

export interface ScheduleType {
  start_time: string;
  end_time: string;
}

export interface Schedule {
  time: ScheduleType;
  addTime: (iTime: ScheduleType) => void;
  clearTime: () => void;
}

export interface footerLinksType {
  id: string;
  title: string;
  href: string;
}

export interface MarketingLayoutProps {
  children: React.ReactNode;
}

export interface AdminsSectionSkeletonProps {
  title: string;
  description: string;
  cardCount: number;
}

export interface DesktopParticlesProps { particles: Particle[] }

export interface InternCardProps {
  intern: Person;
  roleStyles: RoleStyle;
  isCodev: boolean;
  index: number;
  progressive?: boolean;
}

export interface InternCardsAvatarProps {
  person: Person;
  size?: number;
  position?: string;
}

export interface AdminCardProps { admin: Codev }

export interface BlueBgProps { className?: string }

export interface InternCardsProps {
  interns: Person[];
  playOnMount?: boolean;
}

export interface LandingInternCardsRemoteProps {
  page: number;
  pageSize: number;
  initialData: LandingInternsPage;
}

export interface LandingInternCardsProps {
  page: number;
  pageSize: number;
  initialData: LandingInternsPage;
}

export interface LandingInternPaginationProps {
  initialData: LandingInternsPage;
  pageSize?: number;
}

export interface LandingInternPaginationChromeProps {
  page: number;
  totalPages: number;
}

export interface LandingInternShellProps {
  children: ReactNode;
}

export interface LandingInternSkeletonProps {
  page?: number;
  totalPages?: number;
  showPagination?: boolean;
}

export interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface WorkWithUsCardProps {
  card: (typeof WorkWithUsWORK_WITH_US_CARDS)[number];
  index: number;
}
