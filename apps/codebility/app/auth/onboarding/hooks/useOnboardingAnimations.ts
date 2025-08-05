import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseOnboardingAnimationsProps {
  heroRef: RefObject<HTMLDivElement | null>;
  logoRef: RefObject<HTMLDivElement | null>;
  aboutRef: RefObject<HTMLDivElement | null>;
  slidesRef: RefObject<HTMLDivElement | null>;
  regularRef: RefObject<HTMLDivElement | null>;
  h1Ref: RefObject<HTMLHeadingElement | null>;
  roadmapRef?: RefObject<HTMLDivElement | null>;
  setIsLogoVisible: (visible: boolean) => void;
}

export function useOnboardingAnimations({
  heroRef,
  logoRef,
  aboutRef,
  slidesRef,
  regularRef,
  h1Ref,
  roadmapRef,
  setIsLogoVisible,
}: UseOnboardingAnimationsProps) {
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const timeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        const hero = heroRef.current;
        const logo = logoRef.current;
        const about = aboutRef.current;
        const slides = slidesRef.current;
        const regular = regularRef.current;
        const h1 = h1Ref.current;
        const roadmap = roadmapRef?.current;

        if (!hero || !logo || !about || !slides || !regular || !h1) return;

        const slideCount = slides.children.length;
        const slideWidth = window.innerWidth;
        const scrollDistance = slideWidth * (slideCount - 1);
        const logoEndY = window.innerHeight - 210 - 120;

        gsap.from("#welcome-text", { y: -30, opacity: 0, duration: 1 });
        gsap.from("#codebility-h1", { y: 0, opacity: 0, duration: 1.2 });
        gsap.from("#codebility-h2", { opacity: 0, y: 30, duration: 1 });
        gsap.fromTo(
          "#codebility-btn",
          { autoAlpha: 0, y: 60 },
          { autoAlpha: 1, y: 0 },
        );

        gsap.from("#co .letter-co", {
          y: -60,
          opacity: 0,
          ease: "elastic.out(1, 0.5)",
          duration: 1.2,
          stagger: 0.05,
        });

        gsap.from("#ebility .letter-eb", {
          y: -60,
          opacity: 0,
          ease: "elastic.out(1, 0.5)",
          duration: 1.2,
          stagger: 0.05,
          delay: 0.1,
        });

        ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(logo, {
              y: logoEndY * p,
              rotateX: 360 * p,
              rotateZ: 90 * p,
            });
          },
        });

        ScrollTrigger.create({
          trigger: about,
          start: "top top",
          end: `+=${scrollDistance + 200}`,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(logo, {
              rotateX: 360,
              rotateZ: 360 * self.progress,
              y: logoEndY,
            });
          },
        });

        ScrollTrigger.create({
          trigger: about,
          start: "top top",
          end: `+=${scrollDistance + 200}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const x = -scrollDistance * self.progress;
            slides.style.transform = `translate3d(${x}px, 0, 0)`;
          },
        });

        gsap.to("#d", {
          opacity: 1,
          paddingLeft: 0,
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.to("#codebility-h1", {
          marginRight: 0,
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.to("#codebility-h2", { opacity: 1 - p });
            gsap.to("#codebility-btn", {
              autoAlpha: 1 - p,
              filter: `blur(${6 * p}px)`,
            });
          },
        });

        ScrollTrigger.create({
          trigger: regular,
          start: "top bottom",
          onEnter: () => setIsLogoVisible(false),
          onLeaveBack: () => setIsLogoVisible(true),
        });

        if (roadmap) {
          ScrollTrigger.create({
            trigger: roadmap,
            start: "top+=100 top",
            end: "+=1500",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          });
        }

        ScrollTrigger.refresh();
      });

      return () => ctx.revert();
    }, 200);

    return () => clearTimeout(timeout);
  }, []);
}
