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
