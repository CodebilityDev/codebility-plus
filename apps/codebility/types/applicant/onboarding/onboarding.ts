import type { Database } from "@/types/global/supabase";

import type { OnboardingProgressType } from "@/types/applicant/onboarding/applicant-onboarding";

export interface CommitmentProps {
  userName: string;
  onComplete: (signature: string, canDoMobile: boolean) => void;
}

type CodevRow = Database["public"]["Tables"]["codev"]["Row"];
type ApplicantRow = Database["public"]["Tables"]["applicant"]["Row"];

export interface OnboardingClientProps {
  user: Pick<CodevRow, "id" | "first_name" | "last_name">;
  applicantId: string;
  applicantData: Pick<
    ApplicantRow,
    "id" | "quiz_passed" | "quiz_score" | "quiz_total" | "quiz_completed_at" | "commitment_signed_at"
  >;
}

export interface OnboardingStepperProps {
  progress: OnboardingProgressType;
  currentVideo: number;
  onStepClick?: (step: number) => void;
}

export interface QuizProps {
  applicantId: string;
  onQuizComplete: (score: number, totalQuestions: number) => void;
  onBackToVideos?: () => void;
}

export interface VideoPlayerProps {
  videoNumber: number;
  videoId: string;
  applicantId: string;
  onVideoComplete: () => void;
  canWatch: boolean;
}

// --- Minimal YouTube IFrame API typings (avoids `any`) ---
export interface YTPlayer {
  getCurrentTime: () => number;
  getDuration: () => number;
  playVideo: () => void;
  destroy: () => void;
}

export interface YTPlayerStateChangeEvent {
  data: number;
  target: YTPlayer;
}

export interface YTPlayerOptions {
  videoId: string;
  width?: string | number;
  height?: string | number;
  host?: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: { target: YTPlayer }) => void;
    onStateChange?: (event: YTPlayerStateChangeEvent) => void;
    onError?: (event: { data: number }) => void;
  };
}

export interface YTNamespace {
  Player: new (element: HTMLElement | string, options: YTPlayerOptions) => YTPlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
    UNSTARTED: number;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}