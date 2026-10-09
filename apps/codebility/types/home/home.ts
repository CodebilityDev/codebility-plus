import type { ReactNode } from "react";
import type React from "react";

import type { PermissionKey } from "@/types/global/permissions";


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

export interface HomeLayoutProps {
  children: React.ReactNode;
}
