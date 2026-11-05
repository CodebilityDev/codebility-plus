import { Lightbulb, BarChart3, Code2 } from "lucide-react";

import type { Partner } from "@/types/auth/onboarding/onboarding";


export const items = [
  {
    number: "01",
    text: "A self-driven attitude — you’re responsible for your own learning",
    color: "bg-cyan-400",
  },
  {
    number: "02",
    text: "Professionalism in communication, time management, and behavior",
    color: "bg-emerald-400",
  },
  {
    number: "03",
    text: "Active participation in tasks, meetings, and community discussions",
    color: "bg-rose-400",
  },
  {
    number: "04",
    text: "Respect for team members, deadlines, and project goals",
    color: "bg-indigo-400",
  },
  {
    number: "05",
    text: "Willingness to grow from feedback and mistakes",
    color: "bg-amber-400",
  },
  {
    number: "06",
    text: "Transparency — especially if you’re unavailable, struggling, or need support",
    color: "bg-fuchsia-400",
  },
];

export const codeTags = [
  "const",
  "function",
  "<div>",
  "import",
  "return",
  "export",
  "let",
  "async",
  "=>",
];

export const rules = [
  {
    n: 1,
    title: "Show Up With Purpose",
    desc: "Whether you're working on a task or attending a session, be present, prepared, and proactive. Treat this opportunity like it matters — because it does.",
  },
  {
    n: 2,
    title: "Own Your Growth",
    desc: "This isn’t school — it’s real-world learning. Be self-driven, take initiative, and don’t wait to be told what to do. If you’re stuck, ask. If you're curious, explore.",
  },
  {
    n: 3,
    title: "Respect Time — Yours and Others",
    desc: "Be on time. Meet deadlines. Communicate if you’re delayed. Time is a shared resource, and how you manage it reflects your professionalism.",
  },
  {
    n: 4,
    title: "Communicate Clearly, Kindly, and Often",
    desc: "Use our channels (Slack, Discord, etc.) responsibly. Give updates. Ask questions. Support others. Feedback is welcome — but make it constructive.",
  },
  {
    n: 5,
    title: "Be a Team Player",
    desc: "We build together. Be collaborative, helpful, and open-minded. Celebrate wins — big or small — and lift others as you climb.",
  },
  {
    n: 6,
    title: "No Ghosting, No Vanishing",
    desc: "If you need to pause or step back, that’s okay — just communicate. Silence disrupts projects and team trust.",
  },
  {
    n: 7,
    title: "Keep It Professional",
    desc: "Treat everyone with respect, regardless of their background or role. Discrimination, harassment, or unprofessional behavior won't be tolerated.",
  },
  {
    n: 8,
    title: "Protect Our Space",
    desc: "Don’t share internal work or sensitive information outside Codebility without permission. Confidentiality matters — to us and our clients.",
  },
  {
    n: 9,
    title: "Celebrate Progress, Not Perfection",
    desc: "Mistakes are part of learning. Ask questions. Own errors. Share lessons. Growth is the goal, not flawless performance.",
  },
  {
    n: 10,
    title: "This Is a Stepping Stone — Make It Count",
    desc: "We’re not offering salaries — we’re offering experience, mentorship, and a launchpad for your future. What you build here, you take with you.",
  },
];

// Section configuration - maps to each wrapper component
// Line 9-17: Section labels array
export const SECTIONS = [
  { id: "about-section", label: "About Us" },
  { id: "software", label: "Software Development" },
  { id: "expect", label: "What to Expect" },
  { id: "roadmap", label: "Your Roadmap" },
  { id: "house-rules", label: "House Rules" },
  { id: "team", label: "Meet the Team" },
  { id: "partners", label: "Our Partners" },
  { id: "welcome", label: "Signup Now!" }, // ✅ CHANGED: "Welcome Aboard" → "Signup Now!"
];

export const PARTNERS: Partner[] = [
  { id: "ai", src: "/assets/images/partners/ai.png", alt: "AI" },
  { id: "averps", src: "/assets/images/partners/averps.png", alt: "AVERPS" },
  {
    id: "bradwell",
    src: "/assets/images/partners/bradwell.png",
    alt: "Bradwell",
  },
  {
    id: "federal-plans",
    src: "/assets/images/partners/federal-plans.png",
    alt: "Federal Plans",
  },
  {
    id: "fixflow-ai",
    src: "/assets/images/partners/fixflow-ai.png",
    alt: "FixFlow AI",
  },
  {
    id: "genius-web-services",
    src: "/assets/images/partners/genius-web-services.png",
    alt: "Genius Web Services",
  },
  {
    id: "infraspan",
    src: "/assets/images/partners/infraspan.png",
    alt: "Infraspan",
  },
  {
    id: "netmedia",
    src: "/assets/images/partners/netmedia.png",
    alt: "Netmedia",
  },
  {
    id: "tolle-design",
    src: "/assets/images/partners/tolle-design.png",
    alt: "Tolle Design",
  },
  {
    id: "travel-tribe",
    src: "/assets/images/partners/travel-tribe.png",
    alt: "Travel Tribe",
  },
  {
    id: "web-divine",
    src: "/assets/images/partners/web-divine.png",
    alt: "Web Divine",
  },
  {
    id: "zwift-tech",
    src: "/assets/images/partners/zwift-tech.png",
    alt: "Zwift Tech",
  },
];

export const techStacks = [
  {
    title: "Front End",
    items: [
      "React.js / Next.js",
      "Tailwind CSS / Material UI",
      "TypeScript / JavaScript",
      "HTML5 / CSS3",
    ],
  },
  {
    title: "Back End",
    items: [
      "Node.js / Express.js",
      "PostgreSQL / MongoDB",
      "Prisma / Mongoose",
      "Firebase / Supabase",
    ],
  },
  {
    title: "Mobile Development",
    items: ["React Native", "Expo"],
  },
  {
    title: "DevOps & Deployment",
    items: [
      "Docker",
      "Vercel / Netlify",
      "GitHub Actions",
      "AWS / Digital Ocean",
    ],
  },
  {
    title: "UI/UX Design",
    items: ["Figma", "Adobe XD"],
  },
  {
    title: "Project Team & Management",
    items: ["Notion", "Trello / Jira", "Slack / Discord", "GitHub Projects"],
  },
];

export const phases = [
  {
    cx: 540,
    cy: 530,
    color: "#9333ea",
    textX: 280,
    textY: 340,
    title: "Phase 1: Intern (0-100 pts)",
    steps: ["Learn The Basics", "Hands-On Practice", "Version Control"],
    icon: <Lightbulb className="h-6 w-6 text-white" strokeWidth={1.5} />,
  },
  {
    cx: 960,
    cy: 430,
    color: "#db2777",
    textX: 1010,
    textY: 480,
    title: "Phase 2: Codev (100-200 pts)",
    steps: [
      "Deepen Language Proficiency",
      "Explore Frameworks and Libraries",
      "Work On Projects",
      "Development Practices",
    ],
    icon: <BarChart3 className="h-6 w-6 text-white" strokeWidth={1.5} />,
  },
  {
    cx: 1550,
    cy: 360,
    color: "#f59e0b",
    textX: 1280,
    textY: 220,
    title: "Phase 3: Mentor (200+ pts)",
    steps: ["Specialize", "Advanced Concepts", "Collaborate"],
    icon: <Code2 className="h-6 w-6 text-white" strokeWidth={1.5} />,
  },
];
