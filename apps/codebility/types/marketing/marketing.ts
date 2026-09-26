import { ROLE_STYLES } from "@/constants/marketing/marketing";
import { Codev } from "@/types/global/codev";
import { ReactNode } from "react";

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
