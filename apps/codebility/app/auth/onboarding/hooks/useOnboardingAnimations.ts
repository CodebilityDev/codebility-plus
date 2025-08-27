// useOnboardingAnimations.ts
"use client";

import { RefObject, useEffect } from "react";

/** Keep this typing exactly as agreed */
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

/** IDs so we can reliably kill/rebuild */
const IDS = {
  // roadmap
  rdPin: "rd_pin",
  rdTimeline: "rd_timeline",
  // hero/about/regular
  heroFall: "st_hero_fall",
  heroText: "st_hero_text",
  h1D1: "st_h1_d_1",
  h1D2: "st_h1_d_2",
  aboutSpin: "st_about_logo_spin",
  aboutPin: "st_about_pin_slides",
  aboutHideLogo: "st_about_hide_logo",
  regularHideLogo: "st_regular_hide_logo",
};

const ROADMAP_DEBUG = false;

/** Unwrap any .pin-spacer that might remain (GSAP edge cases) */
function unwrapPinSpacers(root: HTMLElement | null) {
  if (!root) return;
  const spacers = root.querySelectorAll<HTMLElement>(".pin-spacer");
  spacers.forEach((spacer) => {
    const child = spacer.firstElementChild as HTMLElement | null;
    if (child && spacer.parentElement) {
      spacer.parentElement.insertBefore(child, spacer);
      spacer.parentElement.removeChild(spacer);
    }
  });
}

/** Clear inline styles on roadmap parts (so mobile shows plain stacked content) */
function clearRoadmapInlineStyles(wrapper: HTMLElement | null, gsap?: any) {
  if (!wrapper) return;
  const stage = (wrapper.querySelector("svg") as SVGSVGElement | null) || null;

  const ids = ["#main-path", "#left-rail", "#right-rail", "#main-arrowhead"];
  ids.forEach((sel) => {
    const el = wrapper.querySelector(sel) as SVGElement | null;
    if (!el) return;
    gsap ? gsap.set(el, { clearProps: "all" }) : el.removeAttribute("style");
  });

  wrapper.querySelectorAll<SVGGElement>(".milestone-group").forEach((g) => {
    if (gsap) {
      gsap.set(g, { clearProps: "all" });
      const circle = g.querySelector("circle");
      const polygon = g.querySelector("polygon");
      const fo = g.querySelector("foreignObject");
      const texts = g.querySelectorAll("g");
      if (circle) gsap.set(circle, { clearProps: "all" });
      if (polygon) gsap.set(polygon, { clearProps: "all" });
      if (fo) gsap.set(fo, { clearProps: "all" });
      texts.forEach((t) => gsap.set(t, { clearProps: "all" }));
    } else {
      g.removeAttribute("style");
    }
  });

  if (stage) stage.removeAttribute("style");
  unwrapPinSpacers(wrapper);
}

/** Kill specific triggers by ID */
function killById(ScrollTrigger: any, ...ids: string[]) {
  ids.forEach((id) => ScrollTrigger.getById(id)?.kill());
}

/** Kill any triggers whose trigger element is inside 'root' */
function killTriggersIn(ScrollTrigger: any, root: HTMLElement | null) {
  if (!root) return;
  ScrollTrigger.getAll().forEach((st: any) => {
    try {
      const trg: Element | null = st.trigger || null;
      if (trg && root.contains(trg)) st.kill();
    } catch {
      /* ignore */
    }
  });
}

export default function useOnboardingAnimations({
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

    let ctx: any | null = null;
    let mm: any | null = null;
    let roadmapObserver: MutationObserver | null = null;

    (async () => {
      // ✅ Load GSAP & ScrollTrigger only on the client
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        mm = gsap.matchMedia();

        // ============ MOBILE (NO GSAP for roadmap; logo hidden) ============
        mm.add("(max-width: 1023.98px)", () => {
          const roadmapSection =
            (roadmapRef?.current as HTMLElement | null) ?? null;
          const roadmapWrapper =
            (roadmapSection?.querySelector(
              "#roadmap-svg-wrapper",
            ) as HTMLElement | null) ||
            roadmapSection ||
            null;

          // Kill roadmap triggers & clean styles
          killById(ScrollTrigger, IDS.rdPin, IDS.rdTimeline);
          killTriggersIn(ScrollTrigger, roadmapSection);
          clearRoadmapInlineStyles(roadmapWrapper, gsap);

          // Kill hero/about triggers on mobile
          killById(
            ScrollTrigger,
            IDS.aboutPin,
            IDS.aboutSpin,
            IDS.aboutHideLogo,
            IDS.heroFall,
            IDS.heroText,
            IDS.h1D1,
            IDS.h1D2,
            IDS.regularHideLogo,
          );
          killTriggersIn(ScrollTrigger, aboutRef.current);

          // Reset hero pieces
          setIsLogoVisible(false);
          if (logoRef.current) gsap.set(logoRef.current, { clearProps: "all" });
          gsap.set(
            ["#codebility-h1", "#codebility-h2", "#codebility-btn", "#d"],
            {
              clearProps:
                "opacity,filter,autoAlpha,transform,transformOrigin,margin,padding",
            },
          );

          const slidesEl = slidesRef.current as HTMLElement | null;
          if (slidesEl) {
            slidesEl.style.transform = "";
            slidesEl.style.willChange = "";
            (slidesEl as any).__willChangeSet = false;
          }

          ScrollTrigger.refresh();
          unwrapPinSpacers(roadmapWrapper);
        });

        // ============ DESKTOP (FULL ROADMAP + HERO/ABOUT) ============
        mm.add("(min-width: 1024px)", () => {
          // -------- ROADMAP --------
          const sec = (roadmapRef?.current as HTMLElement | null) ?? null;
          if (sec) {
            const buildRoadmap = () => {
              const wrapper =
                (sec.querySelector(
                  "#roadmap-svg-wrapper",
                ) as HTMLElement | null) || sec;

              const stage =
                (wrapper.querySelector("svg") as SVGSVGElement | null) ||
                wrapper;
              gsap.set(stage, { display: "block", position: "relative" });

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

              if (!path || !left || !right || !arrow) return false;

              const L = path.getTotalLength();

              type Milestone = {
                el: SVGGElement;
                circle: SVGCircleElement | null;
                polygon: SVGPolygonElement | null;
                icon: Element | null;
                label: SVGGElement | null;
                cy: number;
                revealed: boolean;
              };

              const milestones: Milestone[] = Array.from(
                wrapper.querySelectorAll<SVGGElement>(".milestone-group"),
              ).map((el, i) => {
                const circle = el.querySelector("circle");
                const polygon = el.querySelector("polygon");
                const icon = el.querySelector("foreignObject");
                const label = Array.from(el.querySelectorAll("g")).find((g) =>
                  circle ? !g.contains(circle) : true,
                ) as SVGGElement | null;

                const cyAttr = circle?.getAttribute("cy");
                const fallback = [460, 350, 240, 130][i] ?? 0;
                const cy = cyAttr ? parseFloat(cyAttr) : fallback;

                return {
                  el,
                  circle,
                  polygon,
                  icon,
                  label,
                  cy,
                  revealed: false,
                };
              });

              // Initial states
              gsap.set([path, left, right, arrow], { autoAlpha: 0 });
              gsap.set(path, { strokeDasharray: L, strokeDashoffset: L });
              gsap.set(left, { strokeDasharray: L, strokeDashoffset: L });
              gsap.set(right, { strokeDasharray: L, strokeDashoffset: L });

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

              milestones.forEach(({ el, circle, polygon, icon, label }) => {
                gsap.set(el, { opacity: 0 });
                if (circle)
                  gsap.set(circle, {
                    opacity: 0,
                    scale: 0.6,
                    transformOrigin: "center",
                  });
                if (polygon)
                  gsap.set(polygon, {
                    opacity: 0,
                    scale: 0,
                    transformOrigin: "center",
                  });
                if (icon) gsap.set(icon, { opacity: 0 });
                if (label) gsap.set(label, { opacity: 0 });
              });

              const prog = { t: 0 };

              const tl = gsap.timeline({
                scrollTrigger: {
                  id: IDS.rdPin,
                  trigger: stage,
                  start: "top top",
                  end: "+=2000",
                  scrub: true,
                  pin: true,
                  pinSpacing: true,
                  pinReparent: true,
                  pinType: "fixed",
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                  markers: ROADMAP_DEBUG,
                },
              });

              tl.set([path, left, right], { autoAlpha: 1 });

              tl.to(prog, {
                t: 1,
                duration: 2,
                ease: "none",
                onUpdate: () => {
                  const len = L * prog.t;
                  const pt = path.getPointAtLength(len);
                  const prev = path.getPointAtLength(Math.max(len - 2, 0));

                  const dx = pt.x - prev.x;
                  const dy = pt.y - prev.y;
                  const dist = Math.max(Math.hypot(dx, dy), 0.0001);
                  const ux = dx / dist;
                  const uy = dy / dist;

                  const tipX = pt.x + ux * 35;
                  const tipY = pt.y + uy * 35;
                  const baseX = tipX - ux * 28;
                  const baseY = tipY - uy * 28;
                  const perpX = -uy;
                  const perpY = ux;
                  const lX = baseX + perpX * 20;
                  const lY = baseY + perpY * 20;
                  const rX = baseX - perpX * 20;
                  const rY = baseY - perpY * 20;

                  arrow.setAttribute(
                    "d",
                    `M${tipX},${tipY} L${lX},${lY} L${rX},${rY} Z`,
                  );

                  gsap.set(path, { strokeDashoffset: L - len });
                  gsap.set(left, { strokeDashoffset: L - len });
                  gsap.set(right, { strokeDashoffset: L - len });
                  gsap.set(arrow, { autoAlpha: 1 });

                  milestones.forEach((m) => {
                    const showAt = m.cy - 10;
                    const hideBackAt = m.cy + 14;
                    const passed = pt.y <= showAt;

                    if (!m.revealed && passed) {
                      gsap.to(m.el, {
                        opacity: 1,
                        duration: 0.2,
                        ease: "power1.out",
                      });
                      if (m.circle)
                        gsap.to(m.circle, {
                          opacity: 1,
                          scale: 1,
                          duration: 0.35,
                          ease: "back.out(1.7)",
                        });
                      if (m.polygon)
                        gsap.fromTo(
                          m.polygon,
                          { opacity: 0, scale: 0 },
                          {
                            opacity: 1,
                            scale: 1,
                            duration: 0.28,
                            ease: "back.out(1.7)",
                          },
                        );
                      gsap.to([m.icon, m.label].filter(Boolean), {
                        opacity: 1,
                        duration: 0.3,
                        ease: "power1.out",
                      });
                      m.revealed = true;
                    } else if (m.revealed && pt.y > hideBackAt) {
                      if (m.circle)
                        gsap.to(m.circle, {
                          opacity: 0,
                          scale: 0.6,
                          duration: 0.2,
                          ease: "power1.inOut",
                        });
                      if (m.polygon)
                        gsap.to(m.polygon, {
                          opacity: 0,
                          scale: 0,
                          duration: 0.2,
                          ease: "power1.inOut",
                        });
                      gsap.to([m.icon, m.label].filter(Boolean), {
                        opacity: 0,
                        duration: 0.2,
                        ease: "power1.inOut",
                      });
                      gsap.to(m.el, {
                        opacity: 0,
                        duration: 0.2,
                        ease: "power1.inOut",
                      });
                      m.revealed = false;
                    }
                  });
                },
              });

              const onRefresh = () => {
                ScrollTrigger.removeEventListener("refresh", onRefresh);
                const y = window.scrollY;
                requestAnimationFrame(() => {
                  window.scrollTo(0, y);
                  requestAnimationFrame(() => window.scrollTo(0, y));
                });
              };
              ScrollTrigger.addEventListener("refresh", onRefresh);

              ScrollTrigger.refresh();
              return true;
            };

            const ok = buildRoadmap();
            if (!ok) {
              roadmapObserver?.disconnect();
              roadmapObserver = new MutationObserver(() => {
                if (buildRoadmap()) {
                  roadmapObserver?.disconnect();
                  roadmapObserver = null;
                }
              });
              roadmapObserver.observe(sec, { childList: true, subtree: true });
            }
          }

          // -------- HERO / ABOUT (sticky logo) --------
          const hero = heroRef.current;
          const logo = logoRef.current;
          const about = aboutRef.current;
          const slides = slidesRef.current as HTMLElement | null;
          const regular = regularRef.current;
          const h1 = h1Ref.current;
          if (!(hero && logo && about && slides && regular && h1)) return;

          // Deterministic reset on desktop entry
          const resetLogo = () =>
            gsap.set(logo, { clearProps: "all", y: 0, rotateX: 0, rotateZ: 0 });
          resetLogo();
          setIsLogoVisible(true);

          const slideCount = slides?.children?.length ?? 1;
          const slideWidth = window.innerWidth;
          const distance = slideWidth * Math.max(slideCount - 1, 0);
          const logoEndY = window.innerHeight - 210 - 120;

          // Intro
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

          // Floating logo (hero fall)
          ScrollTrigger.create({
            id: IDS.heroFall,
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

          // About: spin (keeps y parked at end position)
          ScrollTrigger.create({
            id: IDS.aboutSpin,
            trigger: about,
            start: "top top",
            end: `+=${distance + 200}`,
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

          // About: horizontal pin/scroll
          ScrollTrigger.create({
            id: IDS.aboutPin,
            trigger: about,
            start: "top top",
            end: `+=${distance + 200}`,
            scrub: true,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (!slides) return;
              if ((slides as any).__willChangeSet !== true) {
                slides.style.willChange = "transform";
                (slides as any).__willChangeSet = true;
              }
              const x = -distance * self.progress;
              slides.style.transform = `translate3d(${x}px,0,0)`;
            },
          });

          // Hide logo as soon as About ends (guard)
          ScrollTrigger.create({
            id: IDS.aboutHideLogo,
            trigger: about,
            start: "bottom top",
            onEnter: () => setIsLogoVisible(false),
            onLeaveBack: () => {
              resetLogo();
              setIsLogoVisible(true);
            },
          });

          // Hero text blur/fade
          ScrollTrigger.create({
            id: IDS.heroText,
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

          // H1 adjustments
          gsap.to("#d", {
            scrollTrigger: {
              id: IDS.h1D1,
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
            opacity: 1,
            paddingLeft: 0,
          });
          gsap.to("#codebility-h1", {
            scrollTrigger: {
              id: IDS.h1D2,
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
            marginRight: 0,
          });

          // Hide logo when regular enters (extra safety)
          ScrollTrigger.create({
            id: IDS.regularHideLogo,
            trigger: regular,
            start: "top bottom",
            onEnter: () => setIsLogoVisible(false),
            onLeaveBack: () => {
              resetLogo();
              setIsLogoVisible(true);
            },
          });

          ScrollTrigger.refresh();

          // Cleanup for DESKTOP block only
          return () => {
            killById(
              ScrollTrigger,
              IDS.rdPin,
              IDS.rdTimeline,
              IDS.heroFall,
              IDS.heroText,
              IDS.h1D1,
              IDS.h1D2,
              IDS.aboutSpin,
              IDS.aboutPin,
              IDS.aboutHideLogo,
              IDS.regularHideLogo,
            );
            killTriggersIn(ScrollTrigger, sec);
            unwrapPinSpacers(sec || (undefined as any));
          };
        });

        ScrollTrigger.refresh();
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    })();

    return () => {
      try {
        roadmapObserver?.disconnect();
        roadmapObserver = null;
        mm?.revert?.();
        ctx?.revert?.();
      } catch {
        /* noop */
      }
    };
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
