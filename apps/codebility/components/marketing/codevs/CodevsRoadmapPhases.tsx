"use client";

import { useState } from "react";

import { roadmapData } from "@/constants/marketing/codevs/roadmap-data";
import { RoadmapPhaseCard } from "@/components/marketing/codevs/RoadmapPhaseCard";


export default function CodevsRoadmapPhases() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const handlePhaseClick = (phaseId: string) => {
    setSelectedPhase(phaseId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhase(null);
  };

  return (
    <>
      {roadmapData.map((phase, index) => (
        <RoadmapPhaseCard
          key={phase.id}
          phase={phase}
          index={index}
          totalPhases={roadmapData.length}
          onPhaseClick={handlePhaseClick}
        />
      ))}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-w-md rounded-lg bg-gray-800 p-8">
            <h3 className="mb-4 text-2xl font-bold text-white">
              Phase {selectedPhase}
            </h3>
            <p className="mb-6 text-gray-300">Phase details would go here...</p>
            <button
              type="button"
              onClick={handleCloseModal}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
