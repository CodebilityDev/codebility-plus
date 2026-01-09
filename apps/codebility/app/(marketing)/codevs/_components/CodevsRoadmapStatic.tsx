"use client";

import { useState } from "react";

const CodevsRoadmapStatic = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const roadmapData = [
    {
      id: "1",
      phase: "PHASE 1",
      title: "Intern",
      pointsRange: "0-100 points",
      color: "green",
      steps: [
        { id: "1", step: "Learn The Basics" },
        { id: "2", step: "Hands-On Practice" },
        { id: "3", step: "Version Control" },
      ],
    },
    {
      id: "2",
      phase: "PHASE 2",
      title: "Codev",
      pointsRange: "100-200 points",
      color: "teal",
      steps: [
        { id: "1", step: "Deepen Language Proficiency" },
        { id: "2", step: "Explore Frameworks and Libraries" },
        { id: "3", step: "Work On Projects" },
        { id: "4", step: "Development Practices" },
      ],
    },
    {
      id: "3",
      phase: "PHASE 3",
      title: "Mentor",
      pointsRange: "200+ points",
      color: "purple",
      steps: [
        { id: "1", step: "Specialize" },
        { id: "2", step: "Advanced Concepts" },
        { id: "3", step: "Collaborate" },
      ],
    },
  ];

  const handlePhaseClick = (phaseId: string) => {
    setSelectedPhase(phaseId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhase(null);
  };

  return (
    <section id="roadmap" className="w-full py-20">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Career Progression Roadmap
          </h2>
          <p className="text-lg text-gray-400">
            Your Journey from Intern to Mentor at Codebility
          </p>
        </div>

        {/* Roadmap Container */}
        <div className="relative mx-auto max-w-4xl">
          {roadmapData.map((phase, index) => {
            const isLeft = index % 2 === 0;
            const colorClasses = {
              green: {
                border: "border-green-400/50",
                bg: "from-green-500/10 to-emerald-500/10",
                badge: "bg-green-500",
                text: "text-green-400",
                step: "bg-green-500",
              },
              teal: {
                border: "border-teal-400/50",
                bg: "from-teal-500/10 to-cyan-500/10",
                badge: "bg-teal-500",
                text: "text-teal-400",
                step: "bg-teal-500",
              },
              purple: {
                border: "border-purple-400/50",
                bg: "from-purple-500/10 to-pink-500/10",
                badge: "bg-purple-500",
                text: "text-purple-400",
                step: "bg-purple-500",
              },
            };

            const colors = colorClasses[phase.color as keyof typeof colorClasses];

            return (
              <div key={phase.id} className="relative mb-16 md:mb-24">
                {/* Connector Line (except for last item) */}
                {index < roadmapData.length - 1 && (
                  <svg
                    className="absolute top-full hidden h-24 w-full md:block"
                    viewBox="0 0 800 96"
                    preserveAspectRatio="none"
                    style={{ left: 0, width: "100%" }}
                  >
                    <defs>
                      <linearGradient id={`gradient-${phase.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop
                          offset="0%"
                          stopColor={
                            phase.color === "green" ? "#10b981" :
                            phase.color === "teal" ? "#14b8a6" : "#a855f7"
                          }
                          stopOpacity="0.6"
                        />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M ${isLeft ? 200 : 600} 0 C ${isLeft ? 200 : 600} 48, ${!isLeft ? 200 : 600} 48, ${!isLeft ? 200 : 600} 96`}
                      stroke={`url(#gradient-${phase.id})`}
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray="15,10"
                    />
                  </svg>
                )}

                {/* Phase Card */}
                <div
                  className={`relative mx-auto w-full max-w-md cursor-pointer md:mx-0 ${
                    isLeft ? "md:mr-auto md:ml-0" : "md:ml-auto md:mr-0"
                  }`}
                  onClick={() => handlePhaseClick(phase.id)}
                >
                  <div
                    className={`group rounded-xl border ${colors.border} bg-gradient-to-br ${colors.bg} p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                  >
                    {/* Numbered Circle Badge */}
                    <div
                      className={`absolute -left-6 -top-6 flex h-14 w-14 items-center justify-center rounded-full ${colors.badge} text-2xl font-bold text-white shadow-lg ring-4 ring-black/20`}
                    >
                      {phase.id}
                    </div>

                    {/* Check Badge */}
                    <div className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="mb-5 mt-2">
                      <h3
                        className={`mb-1 text-sm font-medium uppercase tracking-wider ${colors.text}`}
                      >
                        {phase.phase}
                      </h3>
                      <h2 className={`text-3xl font-bold ${colors.text}`}>
                        {phase.title}
                      </h2>
                      <p className={`mt-1 text-sm font-semibold ${colors.text}`}>
                        {phase.pointsRange}
                      </p>
                    </div>

                    {/* Steps List */}
                    <ul className="space-y-3">
                      {phase.steps.map((step) => (
                        <li key={step.id} className="flex items-start gap-3">
                          <span
                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${colors.step} text-xs font-semibold text-white`}
                          >
                            0{step.id}
                          </span>
                          <p className="flex-1 text-base font-medium leading-relaxed text-gray-100">
                            {step.step}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Click on any phase card to learn more about the rewards and progression
        </p>
      </div>

      {/* Phase Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md">
            <h3 className="text-2xl font-bold text-white mb-4">Phase {selectedPhase}</h3>
            <p className="text-gray-300 mb-6">Phase details would go here...</p>
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CodevsRoadmapStatic;