import { RefObject } from "react";
import Image from "next/image";

type StickyLogoProps = {
  logoRef: RefObject<HTMLDivElement | null>;
  isVisible: boolean;
};

export default function StickyLogo({ logoRef, isVisible }: StickyLogoProps) {
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  return (
    <div
      ref={logoRef}
      className={`fixed left-1/2 top-[195px] z-[9999] aspect-square w-[120px] -translate-x-1/2 transition-opacity duration-300 ${
        isVisible || !isDesktop ? "" : "pointer-events-none opacity-0"
      }`}
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
