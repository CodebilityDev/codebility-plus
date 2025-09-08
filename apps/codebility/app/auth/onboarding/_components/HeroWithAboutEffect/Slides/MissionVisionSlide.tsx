// components/HeroWithAboutEffect/MissionVisionSlide.tsx

"use client";

export default function MissionVisionSlide() {
  return (
    <div className="slide justify-cente flex w-screen items-center px-6 text-stone-900 lg:h-screen">
      <div className="mx-auto flex max-w-7xl flex-col justify-center gap-10 lg:flex-row lg:gap-16">
        {/* LEFT: Header and Vision */}
        <div className="flex flex-col justify-center">
          <h2 className="w-full text-center text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:max-w-lg lg:text-left">
            To be the world's most impactful developer community
          </h2>

          {/* Vision Card */}
          <div className="mt-10 w-full rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 p-6 shadow-md lg:max-w-lg">
            <div className="mb-2 flex items-center gap-3">
              <VisionIcon />
              <h3 className="text-3xl font-bold">vision</h3>
            </div>
            <p className="text-sm sm:text-base">
              To become the most impactful developer community in the world—
              where aspiring and experienced developers, UI/UX designers, and QA
              professionals grow together, build exceptional portfolios, and
              launch international careers through collaboration, real-world
              experience, and continuous learning.
            </p>
          </div>
        </div>

        {/* RIGHT: Mission */}
        <div className="flex flex-col justify-between gap-6">
          <div className="w-full rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 p-6 shadow-md lg:max-w-xl">
            <div className="mb-2 flex items-center gap-3">
              <MissionIcon />
              <h3 className="text-3xl font-bold">mission</h3>
            </div>
            <ul className="list-disc space-y-2 pl-5 text-sm sm:text-base">
              <li>
                To empower every member to become world-class in their
                craft—whether it’s development, design, or QA.
              </li>
              <li>
                To provide a supportive space where members can learn by doing,
                contribute to real projects, and build confidence through
                experience.
              </li>
              <li>
                To open doors for our members to land global opportunities and
                create meaningful tech careers.
              </li>
              <li>
                To foster a culture of growth, accountability, and curiosity,
                where learning is exciting and shared.
              </li>
            </ul>
          </div>

          {/* Footer Statement */}
          <div className="mt-auto rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 p-4 text-lg font-semibold text-white shadow-lg sm:text-xl">
            Empowering world-class tech talent.
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Icons (inline SVG)
function VisionIcon() {
  return (
    <svg
      className="h-8 w-8 text-purple-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MissionIcon() {
  return (
    <svg
      className="h-8 w-8 text-teal-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 19V6M5 12l7-7 7 7" />
    </svg>
  );
}
