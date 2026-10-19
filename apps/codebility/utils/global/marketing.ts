import { CHILD_SELECTOR, DEFAULT_CHILD_STAGGER } from "@/constants/global/marketing";
import applicationStatusIcon from "@/public/assets/svgs/icon-applicant.svg";
import { IconCog, IconProfile, IconDashboard } from "@/public/assets/svgs/index";

export function pageCacheKey(position: string, page: number, pageSize: number) {
  return `${position}:${page}:${pageSize}`;
}

export function filterCacheKey(position: string, pageSize: number) {
  return `${position}:${pageSize}`;
}

// Get menu items based on user application status
export const getMenuItems = (
  status: string,
  role_id: number,
  applicant: {
    id: string;
    codev_id: string | null;
  } | null,
) => {
  if (
    status === "rejected" ||
    status === "applying" ||
    status === "testing" ||
    status === "onboarding" ||
    status === "denied"
  ) {
    return [
      {
        href:
          status === "rejected" || status === "denied"
            ? "/auth/declined"
            : applicant?.id
              ? "/applicant/waiting"
              : "/auth/waiting",
        icon: applicationStatusIcon,
        label: "Status",
      },
      {
        href: "/applicant/account-settings",
        icon: IconCog,
        label: "Settings",
      },
      { href: "/applicant/profile", icon: IconProfile, label: "Profile" },
    ];
  }
  return [
    { href: "/home", icon: IconDashboard, label: "Dashboard" },
    { href: "/home/account-settings", icon: IconCog, label: "Settings" },
  ];
};

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function snapVisible(element: HTMLElement) {
  element.setAttribute("data-progressive-ready", "");
  element.style.opacity = "1";
  element.style.transform = "none";
  element.querySelectorAll<HTMLElement>(CHILD_SELECTOR).forEach((child) => {
    child.style.opacity = "1";
    child.style.transform = "none";
  });
}

export function hideForEnter(
  element: HTMLElement,
  y: number,
  staggerChildren: number,
) {
  const hidden = `translateY(${y}px)`;

  if (staggerChildren > 0) {
    element.style.opacity = "1";
    element.style.transform = "none";
    element.querySelectorAll<HTMLElement>(CHILD_SELECTOR).forEach((child) => {
      child.style.opacity = "0";
      child.style.transform = hidden;
    });
    return;
  }

  element.style.opacity = "0";
  element.style.transform = hidden;
}

export function resolveStagger(
  element: HTMLElement,
  staggerChildren: number,
): number {
  if (staggerChildren > 0) return staggerChildren;

  const childCount = element.querySelectorAll(CHILD_SELECTOR).length;
  return childCount > 1 ? DEFAULT_CHILD_STAGGER : 0;
}