"use client";

import Image from "next/image";
import { useMediaQuery } from "@/hooks/global/useMediaQuery";
import type { StickyLogoProps } from "@/types/auth/onboarding/onboarding";


export default function StickyLogo({ logoRef, isVisible }: StickyLogoProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div
      ref={logoRef}
      className={`fixed left-[calc(50%-30px)] top-[260px] z-[9999] hidden aspect-square w-[120px] -translate-x-1/2 rounded-full shadow-xl transition-opacity duration-300 will-change-transform lg:block ${
        isVisible || !isDesktop ? "" : "pointer-events-none opacity-0"
      }`}
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "center",
        perspective: "800px",
      }}
    >
      <Image
        src="/assets/images/onboarding/code_logo.svg"
        alt="Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
