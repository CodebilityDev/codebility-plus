import { ReactNode } from "react";

export interface ConditionalMainWrapperProps {
  children: ReactNode;
}

export interface DynamicMainContentProps {
  children: ReactNode;
}

export interface LeftSidebarClientProps {
  initialSidebarData: Sidebar[];
}

export interface SidebarLink {
  route: string;
  label: string;
  imgURL: string;
}

export interface SidebarSection {
  id: string;
  title: string;
  links: SidebarLink[];
}

export interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

export interface ModalProviderHomeProps {
  children?: ReactNode;
}

export interface PostStore {
  isToggleOpen: boolean;
  toggleNav: () => void;
  closeNav: () => void;
}

export type SidebarSidebarLink = {
  route: string;
  imgURL: string;
  label: string;
  permission: PermissionKey;
};

export type Sidebar = {
  id: string;
  title: string;
  links: SidebarSidebarLink[];
};

// Each key is a boolean column on the `roles` table. Add a key here, in the
// select below, and in middleware.ts when a new private page gets a permission.
export type RolePermissions = {
  dashboard: boolean;
  applicants: boolean;
};

export type PermissionKey = keyof RolePermissions;
