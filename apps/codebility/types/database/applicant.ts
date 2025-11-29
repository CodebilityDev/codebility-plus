/**
 * Database Types for Applicant and Onboarding System
 *
 * These types match the Supabase database schema for the applicant onboarding workflow
 * Migration files: add_quiz_and_commitment_fields.sql, create_onboarding_videos_table.sql
 */

/**
 * Applicant table with onboarding fields
 * Tracks test results, quiz scores, commitment, and onboarding progress
 */
export interface ApplicantRow {
  id: string;
  codev_id: string;
  test_taken: string | null; // ISO timestamp
  fork_url: string | null;
  reminded_count: number | null;
  last_reminded_date: string | null; // ISO timestamp

  // Quiz fields
  quiz_score: number | null;
  quiz_total: number | null;
  quiz_passed: boolean | null;
  quiz_completed_at: string | null; // ISO timestamp

  // Commitment and mobile capability
  can_do_mobile: boolean | null;
  commitment_signed_at: string | null; // ISO timestamp
  signature_data: string | null; // Base64 encoded PNG image

  // Timestamps
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Insert type for creating new applicant records
 */
export type ApplicantInsert = Omit<ApplicantRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

/**
 * Update type for modifying applicant records
 */
export type ApplicantUpdate = Partial<Omit<ApplicantRow, 'id' | 'created_at'>>;

/**
 * Onboarding video progress tracking
 * Tracks which videos each applicant has completed
 */
export interface OnboardingVideoProgressRow {
  id: string;
  applicant_id: string;
  video_number: number; // 1, 2, 3, or 4
  completed: boolean;
  completed_at: string | null; // ISO timestamp
  watch_percentage: number | null; // 0-100
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Insert type for video progress
 */
export type OnboardingVideoProgressInsert = Omit<OnboardingVideoProgressRow, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

/**
 * Update type for video progress
 */
export type OnboardingVideoProgressUpdate = Partial<Omit<OnboardingVideoProgressRow, 'id' | 'created_at'>>;

/**
 * Codev user with application status
 * Extended to include new application statuses
 */
export interface CodevRow {
  id: string;
  email_address: string;
  first_name: string;
  last_name: string;

  // Application workflow
  application_status: 'applying' | 'testing' | 'onboarding' | 'waitlist' | 'passed' | 'denied';
  date_applied: string | null; // ISO timestamp

  // Other fields...
  [key: string]: unknown;
}

/**
 * Quiz question structure
 */
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation?: string;
}

/**
 * Onboarding progress state (client-side)
 */
export interface OnboardingProgressType {
  video1: boolean;
  video2: boolean;
  video3: boolean;
  video4: boolean;
  currentVideo: 1 | 2 | 3 | 4;
}

/**
 * Quiz results submission
 */
export interface QuizSubmission {
  applicantId: string;
  quizScore: number;
  quizTotal: number;
  passed: boolean;
}

/**
 * Commitment submission with signature
 */
export interface CommitmentSubmission {
  applicantId: string;
  quizScore: number;
  quizTotal: number;
  signature: string; // Base64 PNG
  canDoMobile: boolean;
}

/**
 * Applicant with nested relations (for admin view)
 */
export interface ApplicantWithDetails extends CodevRow {
  applicant: ApplicantRow | null;
}

/**
 * Database response types for Supabase queries
 */
export type Database = {
  public: {
    Tables: {
      applicant: {
        Row: ApplicantRow;
        Insert: ApplicantInsert;
        Update: ApplicantUpdate;
      };
      onboarding_video_progress: {
        Row: OnboardingVideoProgressRow;
        Insert: OnboardingVideoProgressInsert;
        Update: OnboardingVideoProgressUpdate;
      };
      codev: {
        Row: CodevRow;
        Insert: Partial<CodevRow>;
        Update: Partial<Omit<CodevRow, 'id'>>;
      };
    };
  };
};

/**
 * Email notification types
 */
export type EmailNotificationType =
  | 'test_reminder'
  | 'onboarding_reminder'
  | 'passed_test'
  | 'failed_test'
  | 'accepted'
  | 'denied';

export interface EmailNotificationPayload {
  email: string;
  name: string;
  type: EmailNotificationType;
}
