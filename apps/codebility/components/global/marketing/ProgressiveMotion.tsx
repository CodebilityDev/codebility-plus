"use client";

import { useLayoutEffect, useRef } from "react";
import { animate, stagger } from "framer-motion/dom";

import { attachProgressiveInView, isElementIntersecting } from "@/utils/global/progressive-in-view";
import { markMarketingMotionReady } from "@/utils/global/marketing-motion-ready";
import { VISIBLE_STYLE, CHILD_SELECTOR, EASE } from "@/constants/global/marketing";
import type { ProgressiveMotionProps } from "@/types/global/marketing";
import { prefersReducedMotion, snapVisible, hideForEnter, resolveStagger } from "@/utils/global/marketing";


export default function ProgressiveMotion({
  children,
  className,
  y = 30,
  duration = 0.55,
  amount = 0.2,
  staggerChildren = 0,
  playOnMount = false,
}: ProgressiveMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef<(() => void) | undefined>(undefined);

  useLayoutEffect(() => {
    const element = containerRef.current;
    stopRef.current?.();
    stopRef.current = undefined;

    if (!element) {
      return;
    }

    markMarketingMotionReady();

    let cancelled = false;
    const effectiveStagger = resolveStagger(element, staggerChildren);

    const playEnter = () => {
      if (cancelled) {
        return;
      }

      const childElements =
        element.querySelectorAll<HTMLElement>(CHILD_SELECTOR);

      if (childElements.length > 0 && effectiveStagger > 0) {
        element.style.opacity = "1";
        element.style.transform = "none";
        animate(
          childElements,
          { opacity: 1, transform: "translateY(0px)" },
          {
            duration,
            ease: EASE,
            delay: stagger(effectiveStagger),
            onComplete: () => {
              if (!cancelled) {
                snapVisible(element);
              }
            },
          },
        );
        return;
      }

      animate(
        element,
        { opacity: 1, transform: "translateY(0px)" },
        {
          duration,
          ease: EASE,
          onComplete: () => {
            if (!cancelled) {
              snapVisible(element);
            }
          },
        },
      );
    };

    if (prefersReducedMotion()) {
      snapVisible(element);
      return;
    }

    if (playOnMount) {
      hideForEnter(element, y, effectiveStagger);
      playEnter();
      return () => {
        cancelled = true;
      };
    }

    if (isElementIntersecting(element)) {
      snapVisible(element);
      return () => {
        cancelled = true;
      };
    }

    hideForEnter(element, y, effectiveStagger);

    const stopInView = attachProgressiveInView(
      element,
      (alreadyVisible) => {
        if (cancelled) {
          return;
        }

        if (alreadyVisible) {
          snapVisible(element);
          return;
        }

        playEnter();
      },
      amount,
    );

    stopRef.current = () => {
      cancelled = true;
      stopInView();
    };

    return () => {
      cancelled = true;
      stopInView();
      stopRef.current = undefined;
    };
  }, [amount, duration, playOnMount, staggerChildren, y]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...VISIBLE_STYLE,
        ["--progressive-y" as string]: `${y}px`,
      }}
      data-progressive-root=""
    >
      {children}
    </div>
  );
}
