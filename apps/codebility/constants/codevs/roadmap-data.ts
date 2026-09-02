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

export const roadmapData: RoadmapPhase[] = [
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
