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
          const svgWrapper = document.querySelector("#roadmap-svg-wrapper");

          if (!svgWrapper || svgWrapper.getAttribute("data-ready") !== "true") {
            // Retry shortly after hydration
            setTimeout(() => ScrollTrigger.refresh(), 300);
            return;
          }

          const path = svgWrapper.querySelector(
            "#main-path",
          ) as SVGPathElement | null;
          const left = svgWrapper.querySelector(
            "#left-rail",
          ) as SVGPathElement | null;
          const right = svgWrapper.querySelector(
            "#right-rail",
          ) as SVGPathElement | null;
          const arrow = svgWrapper.querySelector(
            "#main-arrowhead",
          ) as SVGPathElement | null;

          if (!path || !left || !right || !arrow) return;

          const pathLength = path.getTotalLength();
          const progress = { value: 0 };
          const revealed = [false, false, false, false];
          const phaseCys = [460, 350, 240, 130];

          gsap.set([path, left, right, arrow], { autoAlpha: 0 });
          gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          });
          gsap.set(left, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          });
          gsap.set(right, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          });

          gsap.to("#starting-circle", {
            repeat: -1,
            yoyo: true,
            duration: 1,
            scale: 1.2,
            ease: "sine.inOut",
            transformOrigin: "center center",
          });

          gsap.set(".milestone-group circle", {
            opacity: 0,
            scale: 0.6,
            transformOrigin: "center",
          });
          gsap.set(".milestone-group polygon", {
            opacity: 0,
            scale: 0,
            transformOrigin: "center",
          });
          gsap.set(".milestone-group foreignObject", { opacity: 0 });
          gsap.set(".milestone-group g", { opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: roadmap,
              start: "top top",
              end: "+=2000",
              scrub: true,
              pin: true,
            },
          });

          tl.set([path, left, right], { autoAlpha: 1 });

          tl.to(progress, {
            value: 1,
            duration: 2,
            ease: "none",
            onUpdate: () => {
              const len = pathLength * progress.value;
              const pt = path.getPointAtLength(len);
              const prev = path.getPointAtLength(Math.max(len - 2, 0));

              const dx = pt.x - prev.x;
              const dy = pt.y - prev.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const ux = dx / dist;
              const uy = dy / dist;

              const tipX = pt.x + ux * 35;
              const tipY = pt.y + uy * 35;

              const baseX = tipX - ux * 28;
              const baseY = tipY - uy * 28;

              const perpX = -uy;
              const perpY = ux;

              const leftX = baseX + perpX * 20;
              const leftY = baseY + perpY * 20;
              const rightX = baseX - perpX * 20;
              const rightY = baseY - perpY * 20;

              const triangle = `M${tipX},${tipY} L${leftX},${leftY} L${rightX},${rightY} Z`;
              arrow.setAttribute("d", triangle);

              gsap.set(path, { strokeDashoffset: pathLength - len });
              gsap.set(left, { strokeDashoffset: pathLength - len });
              gsap.set(right, { strokeDashoffset: pathLength - len });
              gsap.set(arrow, { autoAlpha: 1 });

              phaseCys.forEach((cy, i) => {
                const el = svgWrapper.querySelectorAll(".milestone-group")[i];
                if (!el) return;

                const circle = el.querySelector("circle");
                const polygon = el.querySelector("polygon");
                const icon = el.querySelector("foreignObject");
                const labels = Array.from(el.querySelectorAll("g")).filter(
                  (g) => !g.contains(circle),
                );
                const label = labels[0];

                const threshold = cy - 10;

                if (!revealed[i] && pt.y <= threshold) {
                  if (circle)
                    gsap.to(circle, {
                      opacity: 1,
                      scale: 1,
                      duration: 0.4,
                      ease: "back.out(1.7)",
                    });
                  if (polygon)
                    gsap.fromTo(
                      polygon,
                      { opacity: 0, scale: 0 },
                      {
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        ease: "back.out(1.7)",
                      },
                    );
                  gsap.to([icon, label], {
                    opacity: 1,
                    delay: 0.2,
                    duration: 0.4,
                    ease: "power1.out",
                  });
                  revealed[i] = true;
                }

                if (revealed[i] && pt.y > threshold + 15) {
                  if (circle)
                    gsap.to(circle, { opacity: 0, scale: 0.6, duration: 0.2 });
                  if (polygon)
                    gsap.to(polygon, { opacity: 0, scale: 0, duration: 0.2 });
                  gsap.to([icon, label], { opacity: 0, duration: 0.2 });
                  revealed[i] = false;
                }
              });
            },
          });
        }

        ScrollTrigger.refresh();
      });

      return () => ctx.revert();
    }, 200);

    return () => clearTimeout(timeout);
  }, []);
}
