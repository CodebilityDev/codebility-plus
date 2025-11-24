"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// Section configuration - maps to each wrapper component
// Line 9-17: Section labels array
const SECTIONS = [
  { id: "about-section", label: "About Us" },
  { id: "software", label: "Software Development" },
  { id: "expect", label: "What to Expect" },
  { id: "roadmap", label: "Your Roadmap" },
  { id: "house-rules", label: "House Rules" },
  { id: "team", label: "Meet the Team" },
  { id: "partners", label: "Our Partners" },
  { id: "welcome", label: "Signup Now!" }, // ✅ CHANGED: "Welcome Aboard" → "Signup Now!"
];

export default function OnboardingStepper() {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0]?.id || "about-section");

  useEffect(() => {
    // Intersection Observer to track which section is in view
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // Trigger when section crosses middle of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe each section
    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll to section when circle is clicked
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <nav
      className="fixed left-6 top-1/2 z-50 hidden -translate-y-1/2 lg:block"
      aria-label="Onboarding progress"
    >
      <div className="relative flex flex-col">
        {/* Connecting line background */}
        <div className="absolute left-2 top-2 h-[calc(100%-16px)] w-0.5 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-800" />

        {/* Progress line that fills as you scroll */}
        <div
          className="absolute left-2 top-2 w-0.5 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-600 transition-all duration-500 ease-out"
          style={{
            height: `${(SECTIONS.findIndex((s) => s.id === activeSection) / (SECTIONS.length - 1)) * 100}%`
          }}
        />

        {SECTIONS.map((section, index) => {
          const isActive = activeSection === section.id;
          const isPassed = SECTIONS.findIndex((s) => s.id === activeSection) > index;
          const isLast = index === SECTIONS.length - 1;

          return (
            <div
              key={section.id}
              className={cn(
                "relative z-10",
                !isLast && "mb-8"
              )}
            >
              <button
                onClick={() => scrollToSection(section.id)}
                className="group relative flex items-center"
                aria-label={`Go to ${section.label}`}
                aria-current={isActive ? "step" : undefined}
              >
                {/* Circle indicator */}
                <div
                  className={cn(
                    "relative flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300",
                    "hover:scale-110 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                    isActive && "scale-125 border-transparent bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 shadow-lg shadow-blue-500/50",
                    isPassed && !isActive && "border-blue-600 bg-blue-600 shadow-md shadow-blue-500/30",
                    !isActive && !isPassed && "border-gray-400 bg-white dark:border-gray-600 dark:bg-gray-900"
                  )}
                >
                  {/* Checkmark for passed sections */}
                  {isPassed && !isActive && (
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  )}

                  {/* Pulsing ring for active section */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 animate-ping opacity-75" />
                      <div className="absolute inset-0 rounded-full bg-white dark:bg-gray-900" style={{ transform: "scale(0.4)" }} />
                    </>
                  )}
                </div>

                {/* Enhanced tooltip label on hover */}
                <div className="pointer-events-none absolute left-8 flex items-center gap-2">
                  <div className={cn(
                    "h-px w-3 bg-gradient-to-r from-gray-400 to-transparent transition-all duration-200 dark:from-gray-600",
                    (isLast || isActive) ? "w-4 opacity-100" : "opacity-0 group-hover:w-4 group-hover:opacity-100"
                  )} />
                  <span
                    className={cn(
                      "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium shadow-xl backdrop-blur-sm transition-all duration-200",
                      "border border-gray-200 bg-white/95 text-gray-900 dark:border-gray-700 dark:bg-gray-800/95 dark:text-white",
                      (isLast || isActive) ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100",
                      isActive && "border-blue-500/20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50"
                    )}
                  >
                    {section.label}
                    {isPassed && !isActive && (
                      <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">✓</span>
                    )}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}