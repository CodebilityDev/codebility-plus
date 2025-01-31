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
    title: "Code Explorer",
    steps: [
      { id: "1", step: "Learn The Basics" },
      { id: "2", step: "Hands-On Practice" },
      { id: "3", step: "Version Control" },
    ],
  },
  {
    id: "2",
    phase: "Phase 2:",
    title: "Code Explorer",
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
    title: "Code Artisan",
    steps: [
      { id: "1", step: "Specialize" },
      { id: "2", step: "Advanced Concepts" },
      { id: "3", step: "Collaborate" },
    ],
  },
  {
    id: "4",
    phase: "Phase 4:",
    title: "Code Maestro",
    steps: [
      { id: "1", step: "Leadership" },
      { id: "2", step: "Innovate" },
      { id: "3", step: "Contribute To The Community" },
      { id: "4", step: "Continues Learning" },
    ],
  },
];
