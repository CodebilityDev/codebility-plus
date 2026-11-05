import { SCROLL_SHRINK_Y } from "@/constants/marketing/marketing";
import type { LandingInternsPage } from "@/types/global/lib";
import type { LandingInternMember } from "@/types/marketing/marketing";

export function wave01(timeMs: number, durationSec: number, delaySec: number) {
  const elapsed = Math.max(0, timeMs / 1000 - delaySec);
  const cycle = (elapsed % durationSec) / durationSec;
  return (1 - Math.cos(cycle * Math.PI * 2)) / 2;
}

export const capitalizeWords = (text: string) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getInitials = (firstName?: string, lastName?: string) => {
  const first = (firstName ?? "").trim().charAt(0);
  const last = (lastName ?? "").trim().charAt(0);
  const initials = `${first}${last}`.toUpperCase();
  return initials || "?";
};

export function pageCacheKey(page: number, pageSize: number) {
  return `rank:${page}:${pageSize}`;
}

export function toTeamMembers(
  members: LandingInternsPage["TEAM_MEMBERS"],
): LandingInternMember[] {
  return members.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role === "Codev" ? "Codev" : "Intern",
    image: member.image,
    display_position: member.display_position,
  }));
}

export function subscribeScrollShrink(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => {
    window.removeEventListener("scroll", onStoreChange);
  };
}

export function getScrollShrinkSnapshot() {
  return window.scrollY >= SCROLL_SHRINK_Y;
}

export function getServerScrollShrinkSnapshot() {
  return false;
}
