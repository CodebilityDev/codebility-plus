import type { ServicesCategorySlug } from "@/types/global/constants";
import type { ServicesProjectsPage } from "@/types/global/lib";
import type { ServicesProjectCard } from "@/types/global/lib";

export interface ServiceDetailModalProps {
  projectId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface ServicesPageContentProps {
  initialData: ServicesProjectsPage;
  pageSize: number;
}

export type ServiceProject = ServicesProjectCard;

export interface ServicesServiceCardProps {
  service: ServiceProject;
  onSelect?: (service: ServiceProject) => void;
}

export interface ServicesTabProps {
  initialData: ServicesProjectsPage;
  category: ServicesCategorySlug;
  pageSize: number;
  onServiceSelect?: (service: ServiceProject) => void;
}

export interface IconFigmaProps { className?: string }

export interface IconGithubProps { className?: string }

export interface IconLinkProps { className?: string }

export interface ServiceDetailBodyProps { projectId: string }

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

export interface ServicesTabRemoteProps {
  category: ServicesCategorySlug;
  page: number;
  pageSize: number;
  initialData: ServicesProjectsPage;
  onServiceSelect?: (service: ServiceProject) => void;
}

export interface ServicesTabGridProps {
  category: ServicesCategorySlug;
  page: number;
  pageSize: number;
  initialData: ServicesProjectsPage;
  onServiceSelect?: (service: ServiceProject) => void;
}
