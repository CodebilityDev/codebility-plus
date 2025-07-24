"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StickyLogo() {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const logo = logoRef.current;
      if (!logo) return;

      const about = document.getElementById("about-section");
      const hero = document.getElementById("hero-section");

      if (!about || !hero) return;

      const logoRect = logo.getBoundingClientRect();
      const targetY = window.innerHeight - logoRect.top - logoRect.height - 40;
      const targetX =
        window.innerWidth / 2 - logoRect.left - logoRect.width / 2;

      // Move logo down during hero scroll
      gsap.to(logo, {
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          endTrigger: about,
          end: "top center",
          scrub: true,
        },
        x: targetX,
        y: targetY,
        ease: "none",
      });

      // Rotate + pin logo during about section scroll
      const slides = about.querySelector(".slides");
      const slideCount = slides?.children.length || 3;
      const totalX = -100 * (slideCount - 1);

      ScrollTrigger.create({
        trigger: about,
        start: "top top",
        end: () => `+=${window.innerWidth * (slideCount - 1)}`,
        scrub: true,
        pin: true,
        anticipatePin: 0.2,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(logo, {
            position: "fixed",
            bottom: "40px",
            left: "50%",
            xPercent: -50,
            y: 0,
            x: 0,
            rotation: 360 * progress,
            zIndex: 999999,
            pointerEvents: "none",
          });
          gsap.set(slides, { xPercent: totalX * progress });
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={logoRef}
      className="pointer-events-none fixed left-1/2 top-10 z-[999999] aspect-square w-[120px] -translate-x-1/2"
    >
      <Image
        src="/assets/images/onboarding/code_logo.svg"
        alt="Logo"
        fill
        className="object-contain"
      />
    </div>
  );
}
