// Onboarding videos are hosted as UNLISTED YouTube videos to avoid Supabase
// Storage egress costs. Each value is a YouTube video ID (the part after
// `watch?v=` or `youtu.be/`), configured per environment via env vars:
//   NEXT_PUBLIC_ONBOARDING_VIDEO_ID_1 ... _4
export const VIDEO_IDS: Record<number, string> = {
  1: process.env.NEXT_PUBLIC_ONBOARDING_VIDEO_ID_1 ?? "", // Introduction - About Codebility
  2: process.env.NEXT_PUBLIC_ONBOARDING_VIDEO_ID_2 ?? "", // Benefits, Culture & Expectations
  3: process.env.NEXT_PUBLIC_ONBOARDING_VIDEO_ID_3 ?? "", // Roadmaps, Milestones & Tech Stack
  4: process.env.NEXT_PUBLIC_ONBOARDING_VIDEO_ID_4 ?? "", // Portal Tour - Gamification & Workflow
};

export const VIDEO_TITLES = {
  1: "Introduction - About Codebility",
  2: "Benefits, Culture & Expectations",
  3: "Roadmaps, Milestones & Tech Stack",
  4: "Portal Tour - Gamification & Workflow",
};

export const VIDEO_DESCRIPTIONS = {
  1: "Learn about Codebility, our mission, and what to expect in your journey with us.",
  2: "Discover the benefits you'll receive, our company culture, and what we expect from our developers.",
  3: "Understand our development roadmaps, project milestones, admin and mentor structure, and the tech stack we use.",
  4: "Take a tour of the Codebility portal and learn how our gamification system, points, and workflow operate.",
};

// Percentage of the video that must be watched before it counts as completed.
export const COMPLETION_THRESHOLD = 98;

// How often (ms) we poll the YouTube player for the current playback position.
export const POLL_INTERVAL_MS = 500;
