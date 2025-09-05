import { RefObject, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseHeroAnimationsProps {
  heroRef: RefObject<HTMLDivElement>;
  logoRef: RefObject<HTMLDivElement>;
  aboutRef: RefObject<HTMLDivElement>;
  slidesRef: RefObject<HTMLDivElement>;
  regularRef: RefObject<HTMLDivElement>;
  h1Ref: RefObject<HTMLHeadingElement>;
  setIsLogoVisible: (visible: boolean) => void;
}

export function useHeroAnimations({
  heroRef,
  logoRef,
  aboutRef,
  slidesRef,
  regularRef,
  h1Ref,
  setIsLogoVisible,
}: UseHeroAnimationsProps) {
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    let ctx: gsap.Context | undefined;

    const setup = () => {
      const hero = heroRef.current;
      const logo = logoRef.current;
      const about = aboutRef.current;
      const slides = slidesRef.current;
      const regular = regularRef.current;
      const h1 = h1Ref.current;

      if (!hero || !logo || !about || !slides || !regular || !h1) return;

      const slideCount = slides.children.length;
      const slideWidth = window.innerWidth;
      const scrollDistance = slideWidth * (slideCount - 1);
      const logoEndY = window.innerHeight - 210 - 120;

      ctx = gsap.context(() => {
        // Animate Hero on load
        gsap.from("#welcome-text", {
          y: -30,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        });
        gsap.from("#codebility-h1", {
          y: 0,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: "bounce.out",
        });
        gsap.from("#codebility-h2", {
          opacity: 0,
          y: 30,
          duration: 1,
          delay: 0.5,
          ease: "power2.out",
        });
        gsap.fromTo(
          "#codebility-btn",
          { autoAlpha: 0, y: 60 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            delay: 0.6,
            ease: "power2.out",
          },
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

        // Sticky logo drop
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
              transformPerspective: 800,
              transformOrigin: "center",
              willChange: "transform",
            });
          },
        });

        // Logo spin + slides
        ScrollTrigger.create({
          trigger: about,
          start: "top top",
          end: () => `+=${scrollDistance + 200}`,
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
          end: () => `+=${scrollDistance + 200}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const x = -scrollDistance * self.progress;
            slides.style.transform = `translate3d(${x}px, 0, 0)`;
          },
        });

        gsap.fromTo(
          h1,
          { y: 0 },
          {
            y: logoEndY,
            ease: "power2.out",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              endTrigger: about,
              end: "top top",
              scrub: true,
            },
          },
        );

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
          trigger: regular,
          start: "top bottom",
          onEnter: () => setIsLogoVisible(false),
          onLeaveBack: () => setIsLogoVisible(true),
        });
      }, hero);

      ScrollTrigger.refresh();
    };

    const rafId = requestAnimationFrame(() => {
      setTimeout(setup, 200);
    });

    const resizeHandler = () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (ctx) ctx.revert();
      ctx = undefined;
      requestAnimationFrame(() => {
        setTimeout(setup, 200);
      });
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeHandler);
      if (ctx) ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
}
