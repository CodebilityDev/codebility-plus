import type React from "react";
export type RoadmapStep = {
  id: string;
  step: string;
};

export type RoadmapPhase = {
  id: string;
  phase: string;
  title: string;
  pointsRange: string;
  color: string;
  steps: RoadmapStep[];
};

export interface OrbitingCirclesProps {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
}

export interface RoadmapPhaseCardProps {
  phase: RoadmapPhase;
  index: number;
  totalPhases: number;
  onPhaseClick: (phaseId: string) => void;
}
