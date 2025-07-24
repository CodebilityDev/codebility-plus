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
    if (
      typeof window === "undefined" ||
      window.innerWidth < 1024 ||
      !heroRef.current ||
      !logoRef.current ||
      !aboutRef.current ||
      !slidesRef.current ||
      !regularRef.current ||
      !h1Ref.current
    )
      return;

    const hero = heroRef.current;
    const logo = logoRef.current;
    const about = aboutRef.current;
    const slides = slidesRef.current;
    const regular = regularRef.current;
    const h1 = h1Ref.current;

    let slideCount = slides.children.length;
    let slideWidth =
      slides.children[0]?.getBoundingClientRect().width || window.innerWidth;
    let scrollDistance = slideWidth * (slideCount - 1);
    let logoEndY = window.innerHeight - 210 - 120;

    const updateLayout = () => {
      slideWidth =
        slides.children[0]?.getBoundingClientRect().width || window.innerWidth;
      scrollDistance = slideWidth * (slideCount - 1);
      logoEndY = window.innerHeight - 210 - 120;
      ScrollTrigger.refresh();
    };

    const animateHeroEntrance = () => {
      gsap.from("#welcome-text", {
        y: -30,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
      gsap.from("#codebility-h1", {
        y: -50,
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
    };

    const setupScrollLinkedEffects = () => {
      gsap.fromTo(
        logo,
        { y: 0 },
        {
          y: () => logoEndY,
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

      gsap.fromTo(
        h1,
        { y: 0 },
        {
          y: () => logoEndY,
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
        id: "slideTrigger",
        trigger: about,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(logo, { rotation: 360 * progress, y: logoEndY });
          gsap.set(slides, { x: -scrollDistance * progress });
        },
      });

      ScrollTrigger.create({
        trigger: regular,
        start: "top bottom",
        onEnter: () => setIsLogoVisible(false),
        onLeaveBack: () => setIsLogoVisible(true),
      });

      ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to("#codebility-h2", {
            filter: `blur(${6 * progress}px)`,
            opacity: 1 - progress,
          });
          gsap.to("#codebility-btn", {
            autoAlpha: 1 - progress,
            filter: `blur(${6 * progress}px)`,
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

      gsap.to("#hero-left-img", {
        rotate: -20,
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to("#hero-right-img", {
        rotate: 20,
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    };

    const ctx = gsap.context(() => {
      animateHeroEntrance();
      setupScrollLinkedEffects();

      Array.from(slides.children).forEach((slide) => {
        (slide as HTMLElement).style.height = "100vh";
      });
    });

    window.addEventListener("resize", updateLayout);

    return () => {
      window.removeEventListener("resize", updateLayout);
      ctx.revert();
    };
  }, []);
}
