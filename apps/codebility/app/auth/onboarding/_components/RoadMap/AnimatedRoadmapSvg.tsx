"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BarChart3, Code2, Lightbulb } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    cx: 220,
    cy: 520,
    color: "#9333ea",
    textX: 40,
    textY: 340,
    title: "Phase 1: Intern (0-100 pts)",
    steps: ["Learn The Basics", "Hands-On Practice", "Version Control"],
    icon: <Lightbulb className="h-6 w-6 text-white" strokeWidth={1.5} />,
  },
  {
    cx: 700, // nudged closer to road curve
    cy: 430,
    color: "#db2777",
    textX: 750,
    textY: 480,
    title: "Phase 2: Codev (100-200 pts)",
    steps: [
      "Deepen Language Proficiency",
      "Explore Frameworks and Libraries",
      "Work On Projects",
      "Development Practices",
    ],
    icon: <BarChart3 className="h-6 w-6 text-white" strokeWidth={1.5} />,
  },
  {
    cx: 1200, // shifted onto road curve
    cy: 420,
    color: "#f59e0b",
    textX: 980,
    textY: 250,
    title: "Phase 3: Mentor (200+ pts)",
    steps: ["Specialize", "Advanced Concepts", "Collaborate"],
    icon: <Code2 className="h-6 w-6 text-white" strokeWidth={1.5} />,
  },
];

export default function AnimatedRoadmapSvg() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Fade-in milestones
    gsap.utils.toArray<SVGGElement>(".milestone-group").forEach((group, i) => {
      gsap.fromTo(
        group,
        { autoAlpha: 0, y: 80 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          delay: i * 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: group,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Animate road path draw
    const path = svgRef.current.querySelector("#center-line");
    if (path) {
      const length = (path as SVGPathElement).getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 6,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    }
  }, []);

  return (
    <>
      {/* Desktop SVG Roadmap */}
      <svg
        ref={svgRef}
        id="roadmap-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1450 700"
        className="hidden h-auto w-full lg:block"
      >
        {/* Road Base (smooth S-shape, extended to end) */}
        <path
          id="main-path"
          d="M 100 550
             C 300 450, 400 650, 600 500
             S 900 300, 1100 400
             S 1250 250, 1400 200"
          stroke="#272728"
          strokeWidth="28"
          fill="none"
          strokeLinecap="round"
        />

        {/* Yellow center line (animated, goes full length) */}
        <path
          id="center-line"
          d="M 100 550
             C 300 450, 400 650, 600 500
             S 900 300, 1100 400
             S 1250 250, 1400 200"
          stroke="#fde047"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* Start marker */}
        <circle cx="100" cy="550" r="18" fill="#22c55e" stroke="#fff" strokeWidth="3" />
        <text x="75" y="590" fontSize="12" fill="#374151" fontWeight="bold">
          Start
        </text>

        {/* Milestones */}
        {phases.map((p, i) => (
          <g key={`p-${i}`} className="milestone-group" style={{ opacity: 0 }}>
            <circle
              cx={p.cx}
              cy={p.cy}
              r="32"
              fill={p.color}
              stroke="#ffffff"
              strokeWidth="3"
            />
            <foreignObject x={p.cx - 18} y={p.cy - 18} width="36" height="36">
              <div className="flex h-full w-full items-center justify-center">
                {p.icon}
              </div>
            </foreignObject>
            <g transform={`translate(${p.textX}, ${p.textY})`}>
              <rect
                width="220"
                height={p.steps.length * 22 + 55}
                rx="12"
                fill="#ffffff"
                stroke="#e5e7eb"
              />
              <rect width="220" height="40" rx="12" fill={p.color} />
              <text x="12" y="26" fontSize="13" fill="white" fontWeight="bold">
                {p.title}
              </text>
              {p.steps.map((s, j) => (
                <text
                  key={`step-${i}-${j}`}
                  x="12"
                  y={62 + j * 22}
                  fontSize="11"
                  fill="#374151"
                >
                  • {s}
                </text>
              ))}
            </g>
          </g>
        ))}
      </svg>

      {/* Mobile Timeline Fallback */}
      <div className="px-6 py-20 lg:hidden">
        <ol className="relative ml-3 space-y-6 border-l border-zinc-300">
          {phases.map((p, i) => (
            <li key={`m-${i}`} className="relative pl-6">
              <span
                className="absolute -left-2 top-1.5 h-4 w-4 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <div className="flex items-start gap-3 text-white">
                <span
                  className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: p.color }}
                >
                  {p.icon}
                </span>
                <div>
                  <h3 className="text-base font-semibold">{p.title}</h3>
                  <ul className="mt-2 list-disc pl-5 text-sm opacity-90">
                    {p.steps.map((s, j) => (
                      <li key={`ms-${i}-${j}`}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}