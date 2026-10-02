import type { ReactNode } from "react";
import type { ServicesCategorySlug } from "@/types/global/constants";
import type { ServicesProjectsPage } from "@/types/global/lib";
import type { ServicesProjectCard, ServicesProjectDetail } from "@/types/global/lib";

export interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export interface ServicesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export type ServiceProject = ServicesProjectCard;

export interface ServicesServiceCardProps {
  service: ServiceProject;
  onSelect?: (service: ServiceProject) => void;
}

export interface ServicesTabProps {
  initialData: ServicesProjectsPage;
  category: ServicesCategorySlug;
}

export interface ServicesTabBarProps {
  active: ServicesCategorySlug | null;
  onSelect?: (category: ServicesCategorySlug) => void;
}

export interface IconFigmaProps { className?: string }

export interface IconGithubProps { className?: string }

export interface IconLinkProps { className?: string }

export interface ServiceDetailBodyProps {
  service: ServicesProjectDetail;
}

export interface ServiceDetailSectionProps {
  projectId: string;
}

export interface ServicesGridSkeletonProps { count?: number }

export interface ServicesPaginationSlotProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ServicesProjectsGridProps {
  projects: ServiceProject[];
  page: number;
  onServiceSelect?: (service: ServiceProject) => void;
}

export interface ServicesDetailModalSlotProps {
  projectId: string | null;
}
