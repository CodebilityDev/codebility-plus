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

/** Toggle once if you need to re-debug */
const ROADMAP_DEBUG = false;
const dbg = ROADMAP_DEBUG ? (...a: any[]) => console.log(...a) : () => {};
const warn = ROADMAP_DEBUG ? (...a: any[]) => console.warn(...a) : () => {};

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
    if (typeof window === "undefined") return;

    const IS_DESKTOP = window.innerWidth >= 1024;

    const timeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        const hero = heroRef.current;
        const logo = logoRef.current;
        const about = aboutRef.current;
        const slides = slidesRef.current as unknown as HTMLElement | null;
        const regular = regularRef.current;
        const h1 = h1Ref.current;
        const roadmapSection =
          roadmapRef?.current as unknown as HTMLElement | null;

        // -------------------------------
        // HERO & ABOUT (desktop only)
        // -------------------------------
        if (IS_DESKTOP) {
          if (hero && logo && about && slides && regular && h1) {
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
                if (!slides) return;
                if ((slides as any).__willChangeSet !== true) {
                  slides.style.willChange = "transform";
                  (slides as any).__willChangeSet = true;
                }
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
          }
        }

        // -------------------------------
        // ROADMAP (always attempt; scoped to section)
        // -------------------------------
        // -------------------------------
        // ROADMAP (desktop only; no pin on mobile)
        // -------------------------------
        if (IS_DESKTOP && roadmapSection) {
          const triggerElem = roadmapSection;

          const tryInit = () => {
            // Look up fresh each time in case dynamic SVG just mounted
            const wrapper = triggerElem.querySelector(
              "#roadmap-svg-wrapper",
            ) as HTMLElement | null;
            if (!wrapper) {
              warn("[Roadmap] wrapper not found yet");
              return false;
            }

            const path = wrapper.querySelector(
              "#main-path",
            ) as SVGPathElement | null;
            const left = wrapper.querySelector(
              "#left-rail",
            ) as SVGPathElement | null;
            const right = wrapper.querySelector(
              "#right-rail",
            ) as SVGPathElement | null;
            const arrow = wrapper.querySelector(
              "#main-arrowhead",
            ) as SVGPathElement | null;
            const startCircle = wrapper.querySelector(
              "#starting-circle",
            ) as SVGCircleElement | null;

            if (!path || !left || !right || !arrow) {
              warn("[Roadmap] missing parts", {
                path: !!path,
                left: !!left,
                right: !!right,
                arrow: !!arrow,
              });
              return false;
            }

            const pathLength = path.getTotalLength();
            const progress = { value: 0 };
            const revealed = [false, false, false, false];

            // Initial states
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

            if (startCircle) {
              gsap.to(startCircle, {
                repeat: -1,
                yoyo: true,
                duration: 1,
                scale: 1.2,
                ease: "sine.inOut",
                transformOrigin: "center center",
              });
            }

            gsap.set(wrapper.querySelectorAll(".milestone-group circle"), {
              opacity: 0,
              scale: 0.6,
              transformOrigin: "center",
            });
            gsap.set(wrapper.querySelectorAll(".milestone-group polygon"), {
              opacity: 0,
              scale: 0,
              transformOrigin: "center",
            });
            gsap.set(
              wrapper.querySelectorAll(".milestone-group foreignObject"),
              { opacity: 0 },
            );
            gsap.set(wrapper.querySelectorAll(".milestone-group g"), {
              opacity: 0,
            });

            // Pin + scrub on the section (desktop only)
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: triggerElem,
                start: "top top",
                end: "+=2000",
                scrub: true,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                markers: ROADMAP_DEBUG,
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

                const dx = pt.x - prev.x,
                  dy = pt.y - prev.y;
                const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 0.0001);
                const ux = dx / dist,
                  uy = dy / dist;

                // Arrowhead geometry
                const tipX = pt.x + ux * 35,
                  tipY = pt.y + uy * 35;
                const baseX = tipX - ux * 28,
                  baseY = tipY - uy * 28;
                const perpX = -uy,
                  perpY = ux;
                const leftX = baseX + perpX * 20,
                  leftY = baseY + perpY * 20;
                const rightX = baseX - perpX * 20,
                  rightY = baseY - perpY * 20;

                arrow.setAttribute(
                  "d",
                  `M${tipX},${tipY} L${leftX},${leftY} L${rightX},${rightY} Z`,
                );

                // Line growth
                gsap.set(path, { strokeDashoffset: pathLength - len });
                gsap.set(left, { strokeDashoffset: pathLength - len });
                gsap.set(right, { strokeDashoffset: pathLength - len });
                gsap.set(arrow, { autoAlpha: 1 });

                // Milestones reveal/hide
                const groups =
                  wrapper.querySelectorAll<SVGGElement>(".milestone-group");
                groups.forEach((el, i) => {
                  const cy = [460, 350, 240, 130][i] ?? 0; // keep the simple 1-liner
                  const circle = el.querySelector("circle");
                  const polygon = el.querySelector("polygon");
                  const icon = el.querySelector("foreignObject");
                  const labels = Array.from(el.querySelectorAll("g")).filter(
                    (g) => !g.contains(circle!),
                  );
                  const label = labels[0];
                  const threshold = cy - 10;

                  if (!revealed[i] && pt.y <= threshold) {
                    gsap.to(el, {
                      opacity: 1,
                      duration: 0.2,
                      ease: "power1.out",
                    }); // show group
                    circle &&
                      gsap.to(circle, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.4,
                        ease: "back.out(1.7)",
                      });
                    polygon &&
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
                    circle &&
                      gsap.to(circle, {
                        opacity: 0,
                        scale: 0.6,
                        duration: 0.2,
                        ease: "power1.inOut",
                      });
                    polygon &&
                      gsap.to(polygon, {
                        opacity: 0,
                        scale: 0,
                        duration: 0.2,
                        ease: "power1.inOut",
                      });
                    gsap.to([icon, label], {
                      opacity: 0,
                      duration: 0.2,
                      ease: "power1.inOut",
                    });
                    gsap.to(el, {
                      opacity: 0,
                      duration: 0.2,
                      ease: "power1.inOut",
                    }); // hide group
                    revealed[i] = false;
                  }
                });
              },
            });

            ScrollTrigger.refresh();
            return true;
          };

          // Try now; if SVG not mounted yet, observe and re-try
          const ok = tryInit();
          if (!ok) {
            const mo = new MutationObserver(() => {
              if (tryInit()) mo.disconnect();
            });
            mo.observe(triggerElem, { childList: true, subtree: true });
          }
        }

        ScrollTrigger.refresh();
      });

      return () => ctx.revert();
    }, 0);

    return () => clearTimeout(timeout);
  }, [
    heroRef,
    logoRef,
    aboutRef,
    slidesRef,
    regularRef,
    h1Ref,
    roadmapRef,
    setIsLogoVisible,
  ]);
}
