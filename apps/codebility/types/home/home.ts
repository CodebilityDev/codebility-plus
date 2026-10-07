import type { ReactNode } from "react";
import type React from "react";


export interface ConditionalMainWrapperProps {
  children: ReactNode;
}

export interface DynamicMainContentProps {
  children: ReactNode;
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

export interface ModalProviderHomeProps {
  children?: ReactNode;
}

export interface PostStore {
  isToggleOpen: boolean;
  toggleNav: () => void;
  closeNav: () => void;
}

export interface SidebarSidebarLink {
  route: string;
  imgURL: string;
  label: string;
  permission: PermissionKey;
}

export interface Sidebar {
  id: string;
  title: string;
  links: SidebarSidebarLink[];
}

// Each key is a boolean column on the `roles` table. Add a key here, in the
// select below, and in proxy.ts when a new private page gets a permission.
export interface RolePermissions {
  dashboard: boolean;
  applicants: boolean;
  kanban: boolean;
}

export type PermissionKey = keyof RolePermissions;

export interface HomeLayoutProps {
  children: React.ReactNode;
}
