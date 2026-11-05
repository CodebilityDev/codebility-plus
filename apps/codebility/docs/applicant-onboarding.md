# Onboarding Video System

This module implements a video-based onboarding system for applicants with sequential video watching validation.

## Features

- **Sequential Video Watching**: Users must complete videos in order (1 → 2 → 3 → 4)
- **Progress Tracking**: Real-time tracking of video watch progress
- **Validation**: Users must watch at least 98% of each video to unlock the next one
- **Visual Progress**: Stepper UI showing completion status
- **Database Persistence**: All progress is saved to the database

## Database Setup

1. Run the SQL migration file to create the required table:

```bash
# Apply the migration in Supabase
psql -h your-supabase-host -U postgres -d postgres -f apps/codebility/supabase/migrations/create_onboarding_videos_table.sql
```

Or use Supabase Dashboard:
- Go to SQL Editor in your Supabase dashboard
- Copy the contents of `supabase/migrations/create_onboarding_videos_table.sql`
- Run the SQL query

## Video Setup

Onboarding videos are hosted as **unlisted YouTube videos** and embedded via the
YouTube IFrame Player API. They are **not** stored on Supabase Storage — doing so
generated excessive cached egress and repeatedly restricted the whole project.

Each video is referenced by its **YouTube ID** through environment variables:

```bash
NEXT_PUBLIC_ONBOARDING_VIDEO_ID_1=<id>  # Introduction - About Codebility
NEXT_PUBLIC_ONBOARDING_VIDEO_ID_2=<id>  # Benefits, Culture & Expectations
NEXT_PUBLIC_ONBOARDING_VIDEO_ID_3=<id>  # Roadmaps, Milestones & Tech Stack
NEXT_PUBLIC_ONBOARDING_VIDEO_ID_4=<id>  # Portal Tour - Gamification & Workflow
```

`OnboardingClient.tsx` reads these into `VIDEO_IDS` and passes them to
`VideoPlayer.tsx`. To swap a video, upload a new **Unlisted** (not Private) video
to YouTube and update the matching env var — no code change needed. Remember that
`NEXT_PUBLIC_*` vars are inlined at build time, so production must be rebuilt.

See `apps/codebility/docs/VIDEO_UPLOAD_GUIDE.md` for full upload steps.

## Flow

1. **Applicant Step 3** (`/applicant/waiting`):
   - When user status is "onboarding" and they've joined Discord
   - "Start Onboarding" button appears
   - Clicking routes to `/applicant/onboarding`

2. **Video Watching** (`/applicant/onboarding` - Step 1-4):
   - Shows progress stepper with 5 steps
   - Displays current video with player controls
   - Tracks watch progress (must watch 98%+ to complete)
   - Next video unlocks only after completing previous one
   - "Proceed to Quiz" button appears after all 4 videos

3. **Quiz** (Step 5a):
   - 6 multiple-choice questions about the onboarding content
   - Must score 70% or higher to pass
   - Shows detailed results with correct answers
   - Can retake if failed
   - Proceeds to commitment after passing

4. **Commitment Agreement** (Step 5b):
   - **Bold warning** to take time thinking through the decision
   - Details the 3-6 months minimum commitment requirement
   - Two acknowledgment checkboxes required
   - Digital signature box (mouse/touch drawing)
   - "I'm Ready to Join Codebility" button

5. **Completion**:
   - Quiz score and signature saved to database
   - User status changes from "onboarding" to "waitlist"
   - Redirects back to waiting page

## Database Schema

### onboarding_videos table
```sql
onboarding_videos
├── id (uuid, PK)
├── applicant_id (uuid, FK → applicant.id)
├── video_number (integer, 1-4)
├── completed (boolean)
├── watched_duration (numeric)
├── total_duration (numeric)
├── completed_at (timestamptz)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

### applicant table (new fields)
```sql
applicant (additions)
├── quiz_score (integer) - Score achieved on quiz
├── quiz_total (integer) - Total possible points
├── signature_data (text) - Base64 encoded signature image
└── commitment_signed_at (timestamptz) - When agreement was signed
```

## Components

### `OnboardingClient.tsx`
Main client component that manages the complete onboarding flow:
- Video watching phase with navigation
- Quiz phase after all videos complete
- Commitment phase after passing quiz
- State management between all phases

### `VideoPlayer.tsx`
Video player component with:
- YouTube IFrame Player API embed (unlisted videos)
- Progress tracking (polls playback position)
- Watch validation (98% threshold)
- Locked state for sequential videos
- Auto-save progress to database

### `Quiz.tsx`
Quiz component featuring:
- 6 multiple-choice questions
- Progress indicator
- 70% passing grade requirement
- Detailed answer review with explanations
- Retake functionality for failed attempts

### `Commitment.tsx`
Commitment agreement component with:
- Prominent warning message about taking time to decide
- Detailed commitment requirements (3-6 months minimum)
- Two acknowledgment checkboxes
- Canvas-based digital signature (mouse/touch support)
- "I'm Ready to Join" final confirmation button

### `OnboardingStepper.tsx`
Visual stepper showing:
- 5 steps with titles (4 videos + Quiz & Commitment)
- Completion status (checkmarks)
- Current step indicator
- Progress line between steps

## Server Actions

### `getOnboardingProgress(applicantId)`
Fetches all video progress for an applicant and calculates current video.

### `updateVideoProgress({ applicantId, videoNumber, watchedDuration, totalDuration, completed })`
Updates or creates video progress record in database.

### `saveQuizAndCommitment({ applicantId, quizScore, quizTotal, signature })`
Saves quiz results and signature data to the applicant record.

### `completeOnboarding(codevId, newStatus)`
Updates user status after onboarding completion. Default status is "waitlist".

## Customization

### Video Titles and Descriptions
Edit in `OnboardingClient.tsx`:
```typescript
const VIDEO_TITLES = {
  1: "Your Title Here",
  // ...
};

const VIDEO_DESCRIPTIONS = {
  1: "Your description here",
  // ...
};
```

### Watch Threshold
Change the completion percentage in `VideoPlayer.tsx`:
```typescript
// Current: 98% threshold
const COMPLETION_THRESHOLD = 98; // change to your desired percentage
```

### Styling
All components use Tailwind CSS and can be customized by modifying the className properties.

## Security Features

- Row Level Security (RLS) policies ensure users can only access their own progress
- Videos are unlisted on YouTube (not indexed/searchable) and embedded without a direct download path
- Progress validation on server-side

## Troubleshooting

### Videos not loading
- Check the YouTube IDs in the `NEXT_PUBLIC_ONBOARDING_VIDEO_ID_*` env vars (IDs, not URLs)
- Ensure each YouTube video is **Unlisted** (not Private) and allows embedding
- In production, confirm you rebuilt after setting/changing the env vars
- Check browser console for IFrame API errors

### Progress not saving
- Check database connection
- Verify `onboarding_videos` table exists
- Check browser console for errors
- Ensure applicant_id is valid

### User can't access onboarding page
- Verify user's `application_status` is "onboarding"
- Check if user has joined Discord (checkbox must be checked)
- Verify applicant record exists in database
