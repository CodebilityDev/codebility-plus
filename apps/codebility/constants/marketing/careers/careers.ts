import { pageSize } from "@/constants/global/page-size";
import type { CareerPath } from "@/types/marketing/careers/careers";
import { Briefcase, TrendingUp, Users, Award, Lightbulb, Target, Heart, Zap, Globe } from "lucide-react";

export const careerPaths: CareerPath[] = [
  {
    id: "junior",
    level: "Entry Level",
    title: "Junior Developer",
    description:
      "Start your career with mentorship and hands-on experience in cutting-edge projects.",
    icon: Briefcase,
    benefits: [
      "Comprehensive onboarding program",
      "Dedicated mentor assignment",
      "Exposure to modern tech stack",
      "Code review and feedback culture",
    ],
    iconBg: "bg-customTeal/10",
    iconColor: "text-customTeal",
    dotColor: "bg-customTeal",
  },
  {
    id: "mid",
    level: "Mid Level",
    title: "Software Engineer",
    description:
      "Take ownership of features and contribute to architectural decisions while growing your expertise.",
    icon: TrendingUp,
    benefits: [
      "Lead feature development",
      "Cross-team collaboration",
      "Technical decision making",
      "Conference and training budget",
    ],
    iconBg: "bg-customBlue-100/10",
    iconColor: "text-customBlue-100",
    dotColor: "bg-customBlue-100",
  },
  {
    id: "senior",
    level: "Senior Level",
    title: "Senior Engineer",
    description:
      "Drive technical excellence, mentor junior developers, and shape the future of our products.",
    icon: Users,
    benefits: [
      "Technical leadership opportunities",
      "Mentoring responsibilities",
      "Architecture design input",
      "Flexible work arrangements",
    ],
    iconBg: "bg-customViolet-100/10",
    iconColor: "text-customViolet-100",
    dotColor: "bg-customViolet-100",
  },
  {
    id: "lead",
    level: "Leadership",
    title: "Technical Lead",
    description:
      "Lead engineering teams, define technical strategy, and drive innovation across the organization.",
    icon: Award,
    benefits: [
      "Team management experience",
      "Strategic planning involvement",
      "Innovation project leadership",
      "Executive development program",
    ],
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
    dotColor: "bg-purple-500",
  },
];

export const PAGE_SIZE = pageSize.careersJobs;

export const JOB_TYPES = ["All", "Full-time", "Part-time", "Contract", "Internship"];

export const JOB_LEVELS = ["All", "Entry", "Mid", "Senior", "Lead"];

export const inter = { className: "font-sans" };

export const outfit = { className: "font-sans" };

export const techCategories = [
  {
    id: 1,
    category: "Frontend",
    technologies: [
      { name: "React", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "Next.js", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
      { name: "TypeScript", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Tailwind CSS", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "Vue.js", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
      { name: "Angular", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
    ],
  },
  {
    id: 2,
    category: "Backend",
    technologies: [
      { name: "Node.js", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Python", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
      { name: "Java", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "C#", className: "bg-purple-500/10 border-purple-500/20 text-purple-500" },
      { name: "PHP", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Go", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
    ],
  },
  {
    id: 3,
    category: "Database",
    technologies: [
      { name: "PostgreSQL", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "MongoDB", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
      { name: "MySQL", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Redis", className: "bg-purple-500/10 border-purple-500/20 text-purple-500" },
      { name: "Supabase", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "Firebase", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
    ],
  },
  {
    id: 4,
    category: "Cloud & DevOps",
    technologies: [
      { name: "AWS", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Docker", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
      { name: "Kubernetes", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "Vercel", className: "bg-purple-500/10 border-purple-500/20 text-purple-500" },
      { name: "GitHub Actions", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Terraform", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
    ],
  },
  {
    id: 5,
    category: "Mobile",
    technologies: [
      { name: "React Native", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "Flutter", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
      { name: "Swift", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Kotlin", className: "bg-purple-500/10 border-purple-500/20 text-purple-500" },
      { name: "Expo", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "Ionic", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
    ],
  },
  {
    id: 6,
    category: "Tools & Others",
    technologies: [
      { name: "Git", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "Jest", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
      { name: "Figma", className: "bg-customBlue-100/10 border-customBlue-100/20 text-customBlue-100" },
      { name: "Jira", className: "bg-purple-500/10 border-purple-500/20 text-purple-500" },
      { name: "Slack", className: "bg-customTeal/10 border-customTeal/20 text-customTeal" },
      { name: "VS Code", className: "bg-customViolet-100/10 border-customViolet-100/20 text-customViolet-100" },
    ],
  },
];

export const workplaceCultureData = [
  {
    id: 1,
    title: "Collaborative Environment",
    description:
      "Work in cross-functional teams where every voice is heard and ideas flourish through open communication.",
    icon: Users,
    iconBg: "bg-customTeal/10",
    iconColor: "text-customTeal",
  },
  {
    id: 2,
    title: "Innovation Driven",
    description:
      "Stay at the forefront of technology with opportunities to work on cutting-edge projects and emerging technologies.",
    icon: Lightbulb,
    iconBg: "bg-customViolet-100/10",
    iconColor: "text-customViolet-100",
  },
  {
    id: 3,
    title: "Results Focused",
    description:
      "Deliver high-quality solutions that create real value for clients while maintaining excellent engineering standards.",
    icon: Target,
    iconBg: "bg-customBlue-100/10",
    iconColor: "text-customBlue-100",
  },
  {
    id: 4,
    title: "Work-Life Balance",
    description:
      "Enjoy flexible schedules, remote work options, and comprehensive benefits that support your well-being.",
    icon: Heart,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
  {
    id: 5,
    title: "Continuous Growth",
    description:
      "Access learning resources, conference budgets, and mentorship programs to advance your technical expertise.",
    icon: Zap,
    iconBg: "bg-customTeal/10",
    iconColor: "text-customTeal",
  },
  {
    id: 6,
    title: "Global Impact",
    description:
      "Contribute to projects that serve clients worldwide and make a meaningful difference in various industries.",
    icon: Globe,
    iconBg: "bg-customViolet-100/10",
    iconColor: "text-customViolet-100",
  },
];
