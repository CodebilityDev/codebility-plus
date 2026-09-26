"use client";

import { useEffect, useRef, useState } from "react";

type Bubble = {
  id: string;
  size: number; // px
  topPct: number;
  leftPct: number;
  hue: number; // 0..360
  depth: number; // parallax multiplier
  floatDur: number; // s
  delay: number; // s
};

export function BubbleBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const [big, setBig] = useState<Bubble[]>([]);
  const [small, setSmall] = useState<Bubble[]>([]);

  // Generate layout once on mount (prevents SSR mismatch)
  useEffect(() => {
    const vw = Math.max(320, window.innerWidth);
    const vh = Math.max(480, window.innerHeight);
    const minDim = Math.min(vw, vh);

    const hues = [285, 200, 165, 320, 255, 210, 300, 180];

    // --- helpers
    const toPct = (px: number, total: number) => (px / total) * 100;
    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.hypot(a.x - b.x, a.y - b.y);

    // --- place 2 big spheres non-overlapping
    const r1 = (0.2 + Math.random() * 0.06) * minDim; // diameter in px (18–24% of min side)
    const r2 = (0.16 + Math.random() * 0.06) * minDim; // diameter in px (16–22%)
    const pad = 24;

    const placeOne = (diam: number) => {
      const r = diam / 2;
      const x = pad + r + Math.random() * (vw - 2 * (pad + r));
      const y = pad + r + Math.random() * (vh - 2 * (pad + r));
      return { x, y, r };
    };

    let A = placeOne(r1);
    let B = placeOne(r2);
    let tries = 0;
    const minGap = 16; // extra spacing buffer
    while (dist(A, B) < A.r + B.r + minGap && tries < 60) {
      B = placeOne(r2);
      tries++;
    }
    // Fallback fixed positions if random couldn’t separate enough
    if (tries >= 60) {
      A = { x: vw * 0.22, y: vh * 0.35, r: r1 / 2 };
      B = { x: vw * 0.76, y: vh * 0.58, r: r2 / 2 };
    }

    const bigSpheres: Bubble[] = [
      {
        id: "big-0",
        size: A.r * 2,
        topPct: toPct(A.y - A.r, vh),
        leftPct: toPct(A.x - A.r, vw),
        hue: hues[0] ?? 285,
        depth: 0.75,
        floatDur: 12 + Math.random() * 5,
        delay: Math.random() * 1.2,
      },
      {
        id: "big-1",
        size: B.r * 2,
        topPct: toPct(B.y - B.r, vh),
        leftPct: toPct(B.x - B.r, vw),
        hue: hues[2] ?? 200,
        depth: 1.0,
        floatDur: 12 + Math.random() * 5,
        delay: Math.random() * 1.2,
      },
    ];

    // --- small accent spheres (avoid overlapping bigs)
    const smallSpheres: Bubble[] = [];
    const wantSmall = 4; // a few accents
    let guard = 0;
    while (smallSpheres.length < wantSmall && guard < 200) {
      guard++;
      const d = 28 + Math.random() * 40; // 28–68px
      const r = d / 2;
      const cx = pad + r + Math.random() * (vw - 2 * (pad + r));
      const cy = pad + r + Math.random() * (vh - 2 * (pad + r));

      const center = { x: cx, y: cy };
      const overlapsBig = [A, B].some((C) => dist(center, C) < C.r + r + 12);
      if (overlapsBig) continue;

      smallSpheres.push({
        id: `s-${smallSpheres.length}`,
        size: d,
        topPct: toPct(cy - r, vh),
        leftPct: toPct(cx - r, vw),
        hue: hues[(3 + smallSpheres.length) % hues.length] ?? 255,
        depth: 0.9,
        floatDur: 7 + Math.random() * 4,
        delay: Math.random() * 3,
      });
    }

    setBig(bigSpheres);
    setSmall(smallSpheres);
  }, []);

  // Mouse parallax via CSS variables (hook-safe)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 16; // -8..+8
      const my = (e.clientY / window.innerHeight - 0.5) * 16;
      el.style.setProperty("--mx", `${mx}px`);
      el.style.setProperty("--my", `${my}px`);
    };
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl"
    >
      {/* subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_40%,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_35%,transparent_65%),radial-gradient(120%_90%_at_50%_120%,rgba(0,0,0,0.65)_0%,rgba(0,0,0,0.92)_60%)]" />

      {/* BIG 3D SPHERES (no outer glow, no overlap) */}
      {big.map((b) => (
        <div
          key={b.id}
          className="bb-float absolute mix-blend-screen will-change-transform"
          style={{
            top: `${b.topPct}%`,
            left: `${b.leftPct}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.floatDur}s`,
            animationDelay: `${b.delay}s`,
            transform: `translate3d(calc(var(--mx,0px) * ${b.depth}), calc(var(--my,0px) * ${b.depth}), 0)`,
            // IMPORTANT: no drop-shadow / no outer glow here
            filter: "saturate(115%)",
          }}
        >
          <svg
            width={b.size}
            height={b.size}
            viewBox={`0 0 ${b.size} ${b.size}`}
            className="block"
          >
            <defs>
              {/* Fresnel-like fill: translucent, brighter near edge, fading out at extremity */}
              <radialGradient id={`f-${b.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={`hsla(${b.hue},100%,60%,0.04)`} />
                <stop offset="55%" stopColor={`hsla(${b.hue},100%,60%,0.08)`} />
                <stop offset="80%" stopColor={`hsla(${b.hue},100%,70%,0.20)`} />
                <stop offset="98%" stopColor={`hsla(${b.hue},100%,70%,0.00)`} />
              </radialGradient>
              {/* inner refractive tint */}
              <radialGradient id={`t-${b.id}`} cx="35%" cy="35%" r="45%">
                <stop
                  offset="0%"
                  stopColor={`hsla(${(b.hue + 40) % 360},100%,70%,0.16)`}
                />
                <stop offset="70%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
              {/* specular highlight */}
              <radialGradient id={`h-${b.id}`} cx="32%" cy="34%" r="9%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>

            {/* translucent sphere body */}
            <g style={{ mixBlendMode: "screen" }}>
              <circle cx="50%" cy="50%" r="50%" fill={`url(#f-${b.id})`} />
              <circle cx="50%" cy="50%" r="50%" fill={`url(#t-${b.id})`} />
            </g>
          </svg>
        </div>
      ))}

      {/* SMALL ACCENT SPHERES (kept subtle, also no outer glow) */}
      {small.map((s) => (
        <div
          key={s.id}
          className="bb-float absolute mix-blend-screen will-change-transform"
          style={{
            top: `${s.topPct}%`,
            left: `${s.leftPct}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.floatDur}s`,
            animationDelay: `${s.delay}s`,
            transform: `translate3d(calc(var(--mx,0px) * ${s.depth}), calc(var(--my,0px) * ${s.depth}), 0)`,
            filter: "saturate(115%)",
          }}
        >
          <svg
            width={s.size}
            height={s.size}
            viewBox={`0 0 ${s.size} ${s.size}`}
            className="block"
          >
            <defs>
              <radialGradient id={`f-${s.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={`hsla(${s.hue},100%,60%,0.04)`} />
                <stop offset="55%" stopColor={`hsla(${s.hue},100%,60%,0.08)`} />
                <stop offset="82%" stopColor={`hsla(${s.hue},100%,70%,0.20)`} />
                <stop offset="98%" stopColor={`hsla(${s.hue},100%,70%,0.00)`} />
              </radialGradient>
            </defs>
            <circle cx="50%" cy="50%" r="50%" fill={`url(#f-${s.id})`} />
          </svg>
        </div>
      ))}

      {/* keyframes */}
      <style jsx global>{`
        @keyframes bb-float-y {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          25% {
            transform: translate3d(2px, -8px, 0) scale(1.02);
          }
          50% {
            transform: translate3d(0, -16px, 0) scale(1);
          }
          75% {
            transform: translate3d(-2px, -8px, 0) scale(0.98);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
        
        @keyframes bb-float-x {
          0% {
            transform: translateX(0);
          }
          33% {
            transform: translateX(4px);
          }
          66% {
            transform: translateX(-4px);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        @keyframes bb-pulse {
          0% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.7;
          }
        }
        
        @keyframes bb-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .bb-float {
          animation: bb-float-y 9s ease-in-out infinite,
                     bb-float-x 7s ease-in-out infinite,
                     bb-pulse 6s ease-in-out infinite,
                     bb-rotate 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
