import { MessageSquare, User, UserCheck, Handshake } from "lucide-react";

export const heroContentClassName =
  "absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 p-4 text-center text-white";

// ─── Static per-card color classes (dynamic Tailwind classes fail at build) ───
// Each card gets explicit static classes instead of `text-${color}` interpolation.
export const hiringSteps = [
  {
    id: 1,
    step: "01",
    title: "Tell Us Your Needs",
    description:
      "Share your project requirements, tech stack preferences, timeline, and team size. We'll help you define the perfect developer profile for your project.",
    icon: MessageSquare,
    // Static Tailwind classes — no interpolation
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-400",
    stepColor: "text-teal-400",
  },
  {
    id: 2,
    step: "02",
    title: "Meet Pre-Vetted Talent",
    description:
      "We present 3-5 carefully selected CoDevs who match your criteria. Each developer has been thoroughly vetted for technical skills and communication abilities.",
    icon: User,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    stepColor: "text-violet-400",
  },
  {
    id: 3,
    step: "03",
    title: "Interview & Select",
    description:
      "Conduct interviews with your shortlisted candidates. We facilitate the process and provide technical assessments to help you make the best choice.",
    icon: UserCheck,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    stepColor: "text-blue-400",
  },
  {
    id: 4,
    step: "04",
    title: "Start Building",
    description:
      "Your selected CoDevs integrate seamlessly with your team. We provide ongoing support to ensure successful project delivery and smooth collaboration.",
    icon: Handshake,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    stepColor: "text-purple-400",
  },
];

// Staggered vertical offsets for alternating layout (cards 1&3 up, 2&4 down)
// Matches the design reference wave pattern
export const STAGGER_OFFSETS = ["mt-0", "mt-16", "mt-0", "mt-16"];

// Animation delay per card for cascading reveal (0ms, 200ms, 400ms, 600ms)
export const ANIMATION_DELAYS = [0, 200, 400, 600];
