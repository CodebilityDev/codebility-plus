"use client";

import {
  useCallback,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { animate, inView, stagger } from "framer-motion/dom";

import { markLandingMotionReady } from "./landing-motion-ready";

const VISIBLE_STYLE: CSSProperties = { opacity: 1, transform: "none" };
const ALREADY_IN_VIEW_MS = 150;
const CHILD_SELECTOR = "[data-progressive-child]";
const EASE = [0.25, 0.46, 0.45, 0.94] as const;

function isIntersecting(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return (
    rect.bottom > 0 &&
    rect.top < window.innerHeight &&
    rect.right > 0 &&
    rect.left < window.innerWidth
  );
}

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

function hideForEnter(element: HTMLElement, y: number) {
  const hidden = `translateY(${y}px)`;
  element.style.opacity = "0";
  element.style.transform = hidden;
  element.querySelectorAll<HTMLElement>(CHILD_SELECTOR).forEach((child) => {
    child.style.opacity = "0";
    child.style.transform = hidden;
  });
}

type ProgressiveMotionProps = {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
  amount?: number | "some" | "all";
  staggerChildren?: number;
};

export default function ProgressiveMotion({
  children,
  className,
  y = 30,
  duration = 0.55,
  amount = 0.2,
  staggerChildren = 0,
}: ProgressiveMotionProps) {
  const stopRef = useRef<(() => void) | undefined>(undefined);

  const motionRef = useCallback(
    (element: HTMLDivElement | null) => {
      stopRef.current?.();
      stopRef.current = undefined;
      if (!element) return;

      markLandingMotionReady();

      let cancelled = false;
      let stopInView: (() => void) | undefined;
      const startedAt = performance.now();

      const playEnter = () => {
        const children = element.querySelectorAll<HTMLElement>(CHILD_SELECTOR);

        if (children.length > 0 && staggerChildren > 0) {
          element.style.opacity = "1";
          element.style.transform = "none";
          animate(
            children,
            { opacity: 1, transform: "translateY(0px)" },
            {
              duration,
              ease: EASE,
              delay: stagger(staggerChildren),
            },
          );
          return;
        }

        animate(
          element,
          { opacity: 1, transform: "translateY(0px)" },
          { duration, ease: EASE },
        );
      };

      const attach = () => {
        if (cancelled) return;

        if (prefersReducedMotion() || isIntersecting(element)) {
          snapVisible(element);
          return;
        }

        hideForEnter(element, y);

        stopInView = inView(
          element,
          (entry) => {
            const immediate =
              performance.now() - startedAt < ALREADY_IN_VIEW_MS ||
              entry.time - startedAt < ALREADY_IN_VIEW_MS;

            if (immediate) {
              snapVisible(element);
              return;
            }

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
    [amount, duration, staggerChildren, y],
  );

  return (
    <div ref={motionRef} className={className} style={VISIBLE_STYLE}>
      {children}
    </div>
  );
}
