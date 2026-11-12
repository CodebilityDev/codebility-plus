import {
  Briefcase,
  CircleCheck,
  Clock,
  Globe,
  LayoutTemplate,
  Monitor,
  Palette,
  Rocket,
  Smartphone,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { CommunityTrack } from "@/types/landing/codevs/community";

export const DISCORD_URL = "https://discord.gg/xhxumQ2dgF";

export const heroStackTags = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Supabase",
  "React Native",
  "Figma",
];

export interface CodevsHeroStat {
  value: string;
  label: string;
  icon: LucideIcon;
  tint: boolean;
}

export const heroStats: CodevsHeroStat[] = [
  { value: "37", label: "Projects shipped", icon: Rocket, tint: true },
  {
    value: "6",
    label: "Tracks: Frontend to DevOps",
    icon: LayoutTemplate,
    tint: false,
  },
];

export interface CodevsTrack {
  title: string;
  icon: LucideIcon;
  skills: string[];
}

export const tracks: CodevsTrack[] = [
  {
    title: "Frontend",
    icon: Monitor,
    skills: ["React / Next.js", "Tailwind", "TypeScript"],
  },
  {
    title: "Backend",
    icon: LayoutTemplate,
    skills: ["Node.js", "PostgreSQL", "Prisma"],
  },
  { title: "Mobile", icon: Smartphone, skills: ["React Native", "Expo"] },
  { title: "UI/UX Design", icon: Palette, skills: ["Figma", "Adobe XD"] },
  { title: "QA", icon: CircleCheck, skills: ["Testing", "Reviews"] },
  {
    title: "DevOps",
    icon: Rocket,
    skills: ["Docker", "Vercel", "GitHub Actions"],
  },
];

export interface CodevsBenefit {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const benefits: CodevsBenefit[] = [
  {
    title: "Real-world experience",
    description:
      "Don't just study, build. Join real projects and grow a portfolio with work that matters.",
    icon: Briefcase,
  },
  {
    title: "Community-driven growth",
    description:
      "Learn alongside devs, designers and QAs, supported by mentors and team leads.",
    icon: Users,
  },
  {
    title: "International opportunities",
    description:
      "Client partnerships help members prepare for and land global remote roles.",
    icon: Globe,
  },
  {
    title: "Learn at your own pace",
    description:
      "No rigid curriculum. Apply what you learn and earn real credibility.",
    icon: Clock,
  },
];

export type RoadmapStatus = "done" | "active" | "upcoming";

export interface RoadmapPhase {
  phase: number;
  title: string;
  points: string;
  status: RoadmapStatus;
  progress: number;
  steps: string[];
}

export const roadmapPhases: RoadmapPhase[] = [
  {
    phase: 1,
    title: "Intern",
    points: "0–100 points",
    status: "done",
    progress: 100,
    steps: ["Learn the basics", "Hands-on practice", "Version control"],
  },
  {
    phase: 2,
    title: "CoDev",
    points: "100–200 points",
    status: "active",
    progress: 55,
    steps: [
      "Deepen language proficiency",
      "Explore frameworks and libraries",
      "Work on projects",
      "Development practices",
    ],
  },
  {
    phase: 3,
    title: "Mentor",
    points: "200+ points",
    status: "upcoming",
    progress: 0,
    steps: ["Specialize", "Advanced concepts", "Collaborate and guide"],
  },
];

export const communityFilters: { value: CommunityTrack; label: string }[] = [
  { value: "all", label: "All" },
  { value: "full-stack", label: "Full Stack" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "mobile", label: "Mobile" },
  { value: "ui-ux", label: "UI/UX" },
  { value: "qa", label: "QA" },
  { value: "mentors", label: "Mentors" },
];

export type AboutTab = "story" | "mission" | "vision";

export const aboutTabs: { value: AboutTab; label: string; points: string[] }[] =
  [
    {
      value: "story",
      label: "Our story",
      points: [
        "Codebility started with one belief: coding is a tool for a brighter future, and anyone willing to learn can use it.",
        "Members learn by contributing to real projects, guided by mentors and team leads instead of a fixed syllabus.",
        "Joining is free. What members earn is experience, a portfolio and a network that lasts.",
        "Members commit three to six months and meet with their team twice a week.",
      ],
    },
    {
      value: "mission",
      label: "Mission",
      points: [
        "Empower every member to become world-class in their craft, whether it's development, design or QA.",
        "Provide a supportive space to learn by doing, contribute to real projects and build confidence.",
        "Open doors for members to land global opportunities and create meaningful tech careers.",
        "Foster a culture of growth, accountability and curiosity, where learning is shared.",
      ],
    },
    {
      value: "vision",
      label: "Vision",
      points: [
        "A world where coding unleashes innovation and talent is not limited by where you start.",
        "A global hub where developers, designers and QA professionals grow side by side.",
        "Members who leave as accomplished builders ready to shape the future of the tech industry.",
      ],
    },
  ];

export const visionStatement =
  "To become the most impactful developer community in the world, where developers, UI/UX designers and QA professionals grow together and launch international careers.";

export interface CodevsFaq {
  question: string;
  answer: string;
}

export const codevsFaqs: CodevsFaq[] = [
  {
    question: "Is the program paid?",
    answer:
      "No salaries. Codebility offers experience, mentorship and a launchpad: real projects, guidance from team leads and a portfolio you take with you.",
  },
  {
    question: "Is this a bootcamp or a course?",
    answer:
      "Neither. There are no fees and no fixed curriculum. You join a team, contribute to real projects and learn from mentors as you go.",
  },
  {
    question: "Who can join: only developers?",
    answer:
      "No. Developers, UI/UX designers and QA testers all join. Pick the track that fits you and add more as you level up.",
  },
  {
    question: "What will I actually work on?",
    answer:
      "Real products, built in a team with a lead and the same stack and tools used in client work.",
  },
  {
    question: "How do I move from Intern to CoDev to Mentor?",
    answer:
      "You earn points by contributing to projects. Interns hold 0 to 100 points, CoDevs 100 to 200, and 200 points opens the Mentor phase.",
  },
  {
    question: "What's expected of me?",
    answer:
      "Plan for three to six months, join the two mandatory team meetings each week and keep your team updated on your work.",
  },
];
