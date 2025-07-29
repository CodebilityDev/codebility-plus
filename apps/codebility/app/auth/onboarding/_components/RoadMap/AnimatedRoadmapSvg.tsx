"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BarChart3, Code2, Lightbulb, Users2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    cx: 260,
    cy: 460,
    color: "#9333ea",
    direction: "top",
    textX: 100,
    textY: 290,
    title: "Phase 1: Code Explorer",
    steps: ["Learn The Basics", "Hands-On Practice", "Version Control"],
    icon: <Lightbulb className="h-6 w-6 text-white" strokeWidth={1.5} />,
  },
  {
    cx: 480,
    cy: 350,
    color: "#db2777",
    direction: "right",
    textX: 520,
    textY: 410,
    title: "Phase 2: Artisan",
    steps: [
      "Deepen Language Proficiency",
      "Explore Frameworks & Libraries",
      "Work On Projects",
      "Development Practices",
    ],
    icon: <BarChart3 className="h-6 w-6 text-white" strokeWidth={1.5} />,
  },
  {
    cx: 700,
    cy: 240,
    color: "#2563eb",
    direction: "top",
    textX: 540,
    textY: 65,
    title: "Phase 3: Specialization",
    steps: ["Specialize", "Advanced Concepts", "Collaborate"],
    icon: <Code2 className="h-6 w-6 text-white" strokeWidth={1.5} />,
  },
  {
    cx: 920,
    cy: 130,
    color: "#059669",
    direction: "right",
    textX: 950,
    textY: 190,
    title: "Phase 4: Code Maestro",
    steps: [
      "Leadership",
      "Innovate",
      "Contribute To The Community",
      "Continues Learning",
    ],
    icon: <Users2 className="h-6 w-6 text-white" strokeWidth={1.5} />,
  },
];

export default function AnimatedRoadmapSvg() {
  const pathRef = useRef<SVGPathElement>(null);
  const leftRailRef = useRef<SVGPathElement>(null);
  const rightRailRef = useRef<SVGPathElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const path = pathRef.current;
    const left = leftRailRef.current;
    const right = rightRailRef.current;
    const arrow = arrowRef.current;
    if (!path || !left || !right || !arrow) return;

    const pathLength = path.getTotalLength();
    const progress = { value: 0 };
    const revealed = [false, false, false, false]; // milestone flags

    const phaseCys = [460, 350, 240, 130];

    gsap.set([path, left, right, arrow], { autoAlpha: 0 });
    gsap.set(".milestone-group circle", {
      display: "block",
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
    gsap.set(".milestone-group g", { opacity: 0 }); // NOTE: all <g> includes labels

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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#isroadmap-trigger",
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

        const tipX = pt.x + ux * 22;
        const tipY = pt.y + uy * 22;

        const baseX = tipX - ux * 28;
        const baseY = tipY - uy * 28;

        const perpX = -uy;
        const perpY = ux;

        const leftX = baseX + perpX * 30;
        const leftY = baseY + perpY * 30;
        const rightX = baseX - perpX * 30;
        const rightY = baseY - perpY * 30;

        const triangle = `M${tipX},${tipY} L${leftX},${leftY} L${rightX},${rightY} Z`;
        arrow.setAttribute("d", triangle);

        gsap.set(path, {
          strokeDashoffset: pathLength - len,
        });
        gsap.set(left, {
          strokeDashoffset: pathLength - len,
        });
        gsap.set(right, {
          strokeDashoffset: pathLength - len,
        });
        gsap.set(arrow, { autoAlpha: 1 });

        phaseCys.forEach((cy, i) => {
          const el = document.querySelectorAll(".milestone-group")[i];
          if (!el) return;

          const circle = el.querySelector("circle");
          const arrow = el.querySelector("polygon");
          const icon = el.querySelector("foreignObject");
          const labels = Array.from(el.querySelectorAll("g")).filter(
            (g) => !g.contains(circle),
          );
          const label = labels[0]; // first label group

          const threshold = cy - 10;

          // 🟢 Scroll down: show
          if (!revealed[i] && pt.y <= threshold) {
            if (circle) {
              gsap.to(circle, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: "back.out(1.7)",
              });
            }

            if (arrow) {
              gsap.fromTo(
                arrow,
                { opacity: 0, scale: 0, transformOrigin: "center" },
                {
                  opacity: 1,
                  scale: 1,
                  duration: 0.3,
                  ease: "back.out(1.7)",
                },
              );
            }

            gsap.to([icon, label], {
              opacity: 1,
              delay: 0.2,
              duration: 0.4,
              ease: "power1.out",
            });

            revealed[i] = true;
          }

          // 🔴 Scroll up: hide
          if (revealed[i] && pt.y > threshold + 15) {
            if (circle) {
              gsap.to(circle, {
                opacity: 0,
                scale: 0.6,
                duration: 0.2,
                ease: "power1.inOut",
              });
            }

            if (arrow) {
              gsap.to(arrow, {
                opacity: 0,
                scale: 0,
                transformOrigin: "center",
                duration: 0.2,
                ease: "power1.inOut",
              });
            }

            gsap.to([icon, label], {
              opacity: 0,
              duration: 0.2,
              ease: "power1.inOut",
            });

            revealed[i] = false;
          }
        });
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <svg
      id="roadmap-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 600"
      className="h-auto w-full"
    >
      <path
        id="main-path"
        ref={pathRef}
        d="M 180 500 L 480 350 L 700 240 L 1020 80"
        stroke="#272728"
        strokeWidth="25"
        fill="none"
        strokeLinecap="round"
      />

      <path
        id="left-rail"
        ref={leftRailRef}
        d="M 180 500 L 480 350 L 700 240 L 1020 80"
        stroke="#fde047"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        transform="translate(-3, 3)"
      />
      <path
        id="right-rail"
        ref={rightRailRef}
        d="M 180 500 L 480 350 L 700 240 L 1020 80"
        stroke="#fde047"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        transform="translate(3, -3)"
      />

      <path id="arrowhead" ref={arrowRef} d="" fill="#272728" />
      <circle id="starting-circle" cx="170" cy="505" r="20" fill="#272728" />

      {phases.map((p, i) => (
        <g className="milestone-group" key={`phase-${i}`}>
          <circle
            cx={p.cx}
            cy={p.cy}
            r="35"
            fill={p.color}
            style={{ display: "none" }}
          />

          {p.direction === "top" && (
            <polygon
              points={`${p.cx},${p.cy - 35 - 18} ${p.cx - 6},${p.cy - 35} ${p.cx + 6},${p.cy - 35}`}
              fill={p.color}
            />
          )}

          {p.direction === "right" &&
            (() => {
              const angle = (60 * Math.PI) / 180; // 5 o'clock
              const r = 35; // circle radius
              const h = 18; // tip distance from circle edge
              const b = 12; // base width

              const tipX = p.cx + Math.cos(angle) * (r + h);
              const tipY = p.cy + Math.sin(angle) * (r + h);

              const baseCx = p.cx + Math.cos(angle) * r;
              const baseCy = p.cy + Math.sin(angle) * r;

              const dx = Math.cos(angle + Math.PI / 2) * (b / 2);
              const dy = Math.sin(angle + Math.PI / 2) * (b / 2);

              const base1X = baseCx + dx;
              const base1Y = baseCy + dy;
              const base2X = baseCx - dx;
              const base2Y = baseCy - dy;

              return (
                <polygon
                  points={`${tipX},${tipY} ${base1X},${base1Y} ${base2X},${base2Y}`}
                  fill={p.color}
                />
              );
            })()}

          <foreignObject x={p.cx - 24} y={p.cy - 24} width="48" height="48">
            <div className="flex h-full w-full items-center justify-center">
              {p.icon}
            </div>
          </foreignObject>
          <g transform={`translate(${p.textX}, ${p.textY})`}>
            <rect
              width="180"
              height={p.steps.length * 20 + 32}
              rx="10"
              fill={p.color}
            />
            <text x="10" y="20" fontSize="12" fill="white" fontWeight="bold">
              {p.title}
            </text>
            {p.steps.map((s, j) => (
              <text
                key={`step-${i}-${j}`}
                x="10"
                y={40 + j * 20}
                fontSize="10"
                fill="white"
              >
                • {s}
              </text>
            ))}
          </g>
        </g>
      ))}
    </svg>
  );
}
