interface RoadmapStep {
  id: string;
  step: string;
}

interface RoadmapPhase {
  id: string;
  phase: string;
  title: string;
  steps: RoadmapStep[];
}

export const roadmapData: RoadmapPhase[] = [
  {
    id: "1",
    phase: "Phase 1:",
    title: "Intern",
    steps: [
      { id: "1", step: "Learn The Basics" },
      { id: "2", step: "Hands-On Practice" },
      { id: "3", step: "Version Control" },
    ],
  },
  {
    id: "2",
    phase: "Phase 2:",
    title: "Codev",
    steps: [
      { id: "1", step: "Deepen Language Proficiency" },
      { id: "2", step: "Explore Frameworks and Libraries" },
      { id: "3", step: "Work On Projects" },
      { id: "4", step: "Development Practices" },
    ],
  },
  {
    id: "3",
    phase: "Phase 3:",
    title: "Mentor",
    steps: [
      { id: "1", step: "Specialize" },
      { id: "2", step: "Advanced Concepts" },
      { id: "3", step: "Collaborate" },
    ],
  },
];
