"use client";

import {
  useCallback,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { animate, inView, stagger } from "framer-motion/dom";

import { markMarketingMotionReady } from "./marketing-motion-ready";

const VISIBLE_STYLE: CSSProperties = { opacity: 1, transform: "none" };
const DEFAULT_CHILD_STAGGER = 0.08;
const CHILD_SELECTOR = "[data-progressive-child]";
const EASE = [0.25, 0.46, 0.45, 0.94] as const;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function snapVisible(element: HTMLElement) {
  element.style.opacity = "1";
  element.style.transform = "none";
  element.querySelectorAll<HTMLElement>(CHILD_SELECTOR).forEach((child) => {
    child.style.opacity = "1";
    child.style.transform = "none";
  });
}

function hideForEnter(
  element: HTMLElement,
  y: number,
  staggerChildren: number,
) {
  const hidden = `translateY(${y}px)`;

  if (staggerChildren > 0) {
    element.style.opacity = "1";
    element.style.transform = "none";
    element.querySelectorAll<HTMLElement>(CHILD_SELECTOR).forEach((child) => {
      child.style.opacity = "0";
      child.style.transform = hidden;
    });
    return;
  }

  element.style.opacity = "0";
  element.style.transform = hidden;
}

function resolveStagger(
  element: HTMLElement,
  staggerChildren: number,
): number {
  if (staggerChildren > 0) return staggerChildren;

  const childCount = element.querySelectorAll(CHILD_SELECTOR).length;
  return childCount > 1 ? DEFAULT_CHILD_STAGGER : 0;
}

type ProgressiveMotionProps = {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  amount?: number | "some" | "all";
  staggerChildren?: number;
  /** Play enter animation immediately on mount (hero sections). */
  playOnMount?: boolean;
};

export default function ProgressiveMotion({
  children,
  className,
  y = 30,
  duration = 0.55,
  amount = 0.2,
  staggerChildren = 0,
  playOnMount = false,
}: ProgressiveMotionProps) {
  const stopRef = useRef<(() => void) | undefined>(undefined);

  const motionRef = useCallback(
    (element: HTMLDivElement | null) => {
      stopRef.current?.();
      stopRef.current = undefined;
      if (!element) return;

      markMarketingMotionReady();

      let cancelled = false;
      let stopInView: (() => void) | undefined;
      const effectiveStagger = resolveStagger(element, staggerChildren);

      const playEnter = () => {
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
                snapVisible(element);
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
              snapVisible(element);
            },
          },
        );
      };

      const attach = () => {
        if (cancelled) return;

        if (prefersReducedMotion()) {
          snapVisible(element);
          return;
        }

        hideForEnter(element, y, effectiveStagger);

        if (playOnMount) {
          playEnter();
          return;
        }

        let hasEntered = false;

        stopInView = inView(
          element,
          () => {
            if (hasEntered) return;
            hasEntered = true;
            stopInView?.();
            stopInView = undefined;
            playEnter();
          },
          { amount },
        );
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(attach);
      });

      stopRef.current = () => {
        cancelled = true;
        stopInView?.();
      };
    },
    [amount, duration, playOnMount, staggerChildren, y],
  );

  return (
    <div ref={motionRef} className={className} style={VISIBLE_STYLE}>
      {children}
    </div>
  );
}
