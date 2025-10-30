"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Section configuration - maps to each wrapper component
const SECTIONS = [
  { id: "software", label: "Software Development" },
  { id: "expect", label: "What to Expect" },
  { id: "roadmap", label: "Your Roadmap" },
  { id: "house-rules", label: "House Rules" },
  { id: "team", label: "Meet the Team" },
  { id: "partners", label: "Our Partners" },
  { id: "welcome", label: "Welcome Aboard" },
];

export default function OnboardingStepper() {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);

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
      <div className="flex flex-col gap-6">
        {SECTIONS.map((section, index) => {
          const isActive = activeSection === section.id;
          const isPassed = SECTIONS.findIndex((s) => s.id === activeSection) > index;

          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group relative flex items-center"
              aria-label={`Go to ${section.label}`}
              aria-current={isActive ? "step" : undefined}
            >
              {/* Circle indicator */}
              <div
                className={cn(
                  "h-4 w-4 rounded-full border-2 transition-all duration-300",
                  isActive && "scale-125 border-blue-600 bg-blue-600",
                  isPassed && "border-blue-600 bg-blue-600",
                  !isActive && !isPassed && "border-gray-400 bg-transparent"
                )}
              />

              {/* Tooltip label on hover */}
              <span className="absolute left-8 whitespace-nowrap rounded bg-gray-900 px-3 py-1.5 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-100 dark:text-gray-900">
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}