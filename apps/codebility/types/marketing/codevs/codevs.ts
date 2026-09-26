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
