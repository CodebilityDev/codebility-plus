import { pageSize } from "@/constants/global/page-size";
import type { InternalStatus } from "@/types/global/codev";
import type { EmblaOptionsType } from "embla-carousel";
import type { CSSProperties } from "react";

export const STATUS_CONFIG: Record<InternalStatus, { label: string; className: string }> = {
  TRAINING: {
    label: "Training",
    className:
      "bg-yellow-500/20 backdrop-blur-sm text-yellow-200 border border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-300",
  },
  GRADUATED: {
    label: "Graduated",
    className:
      "bg-green-500/20 backdrop-blur-sm text-green-200 border border-green-500/30 dark:bg-green-500/10 dark:text-green-300",
  },
  INACTIVE: {
    label: "Inactive",
    className:
      "bg-gray-500/20 backdrop-blur-sm text-gray-200 border border-gray-500/30 dark:bg-gray-500/10 dark:text-gray-300",
  },
  MENTOR: {
    label: "Mentor",
    className:
      "bg-purple-500/20 backdrop-blur-sm text-purple-200 border border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300",
  },
  ADMIN: {
    label: "Admin",
    className:
      "bg-blue-500/20 backdrop-blur-sm text-blue-200 border border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300",
  },
  DEPLOYED: {
    label: "Deployed",
    className:
      "bg-indigo-500/20 backdrop-blur-sm text-indigo-200 border border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300",
  },
};

export const CAROUSEL_OPTIONS: EmblaOptionsType = {
  loop: true,
  align: "center",
  containScroll: "trimSnaps",
};

export const inter = { className: "font-sans" };

export const outfit = { className: "font-sans" };

export const PAGE_SIZE = pageSize.codevsProfiles;

// Navigation items for top navbar and mobile drawer
export const NAV_ITEMS = [
  { id: "1", title: "Our Services", path: "/services" },
  { id: "2", title: "About Us", path: "/#whychooseus" },
  { id: "3", title: "Book a Call", path: "/bookacall" },
  { id: "4", title: "Be a Codev", path: "/codevs" }, // ✅ ADDED: New link after Book a Call
  { id: "5", title: "Hire a CoDevs", path: "/hire-a-codev" },
] as const;

export const NAV_USER_PROFILE_KEY = "user_profile";

export const VISIBLE_STYLE: CSSProperties = { opacity: 1, transform: "none" };

export const DEFAULT_CHILD_STAGGER = 0.08;

export const CHILD_SELECTOR = "[data-progressive-child]";

export const EASE = [0.25, 0.46, 0.45, 0.94] as const;
