"use client";

import React from "react";
import { BarChart3, Code2, Lightbulb, Users2 } from "lucide-react";

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
  return (
    <>
      {/* Desktop: SVG (animated by GSAP) */}
      <svg
        id="roadmap-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 600"
        className="hidden h-auto w-full lg:block"
      >
        {/* Main path */}
        <path
          id="main-path"
          d="M 180 500 L 480 350 L 700 240 L 1020 80"
          stroke="#272728"
          strokeWidth="25"
          fill="none"
          strokeLinecap="round"
        />
        {/* Yellow rails */}
        <path
          id="left-rail"
          d="M 180 500 L 480 350 L 700 240 L 1020 80"
          stroke="#fde047"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          transform="translate(-3, 3)"
        />
        <path
          id="right-rail"
          d="M 180 500 L 480 350 L 700 240 L 1020 80"
          stroke="#fde047"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          transform="translate(3, -3)"
        />

        {/* Main arrowhead (hook rewrites its “d”) */}
        <path
          id="main-arrowhead"
          d={(() => {
            const tipX = 1020;
            const tipY = 80;
            const prevX = 700;
            const prevY = 240;

            const dx = tipX - prevX;
            const dy = tipY - prevY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const ux = dx / dist;
            const uy = dy / dist;

            // push 35px past path end
            const finalTipX = tipX + ux * 30;
            const finalTipY = tipY + uy * 30;

            // base 28px behind tip
            const baseX = finalTipX - ux * 28;
            const baseY = finalTipY - uy * 28;

            // perpendicular for width
            const perpX = -uy;
            const perpY = ux;

            const leftX = baseX + perpX * 20;
            const leftY = baseY + perpY * 20;
            const rightX = baseX - perpX * 20;
            const rightY = baseY - perpY * 20;

            return `M${finalTipX},${finalTipY} L${leftX},${leftY} L${rightX},${rightY} Z`;
          })()}
          fill="#272728"
        />

        {/* Starting circle (badge with pulsing outer ring + START text) */}
        <g id="starting-badge" aria-label="Start">
          {/* core fill */}
          <circle cx="170" cy="505" r="28" fill="#16a34a" />

          {/* OUTER ring — pulses */}
          <circle cx="170" cy="505" r="28" fill="none" stroke="#ffffff">
            <animate
              attributeName="stroke-width"
              values="2;4;2"
              dur="1.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.5;1"
              dur="1.6s"
              repeatCount="indefinite"
            />
          </circle>

          {/* inner ring — static */}
          <circle
            cx="170"
            cy="505"
            r="22"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            opacity="0.95"
          />

          {/* centered label */}
          <text
            x="170"
            y="505"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="700"
            fill="#ffffff"
            letterSpacing="1.2"
          >
            START
          </text>
        </g>

        {/* Milestones */}
        {phases.map((p, i) => (
          <g key={`p-${i}`} className="milestone-group" style={{ opacity: 0 }}>
            {/* Circle */}
            <circle cx={p.cx} cy={p.cy} r="35" fill={p.color} />

            {/* Directional arrow */}
            {p.direction === "top" && (
              <polygon
                points={`${p.cx},${p.cy - 35 - 18} ${p.cx - 6},${p.cy - 35} ${p.cx + 6},${p.cy - 35}`}
                fill={p.color}
              />
            )}
            {p.direction === "right" &&
              (() => {
                const angle = (60 * Math.PI) / 180; // ~5 o'clock
                const r = 35;
                const h = 18;
                const b = 12;

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

            {/* Icon */}
            <foreignObject x={p.cx - 24} y={p.cy - 24} width="48" height="48">
              <div className="flex h-full w-full items-center justify-center">
                {p.icon}
              </div>
            </foreignObject>

            {/* Label */}
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

      {/* Mobile: simple vertical roadmap list */}
      <div className="px-6 py-20 lg:hidden">
        <ol className="text-black-400 relative ml-3 space-y-6 border-l border-zinc-300 dark:border-zinc-700">
          {phases.map((p, i) => (
            <li key={`m-${i}`} className="relative pl-6">
              {/* Dot */}
              <span
                className="absolute -left-2 top-1.5 h-4 w-4 rounded-full ring-2 ring-white dark:ring-zinc-900"
                style={{ backgroundColor: p.color }}
                aria-hidden="true"
              />
              <div className="flex items-start gap-3 text-white">
                <span
                  className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full shadow-sm"
                  style={{ backgroundColor: p.color }}
                >
                  {p.icon}
                </span>
                <div>
                  <h3 className="text-base font-semibold leading-6">
                    {p.title}
                  </h3>
                  <ul className="mt-2 list-disc pl-5 text-sm/6 opacity-90">
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
