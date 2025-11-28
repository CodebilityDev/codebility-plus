# Onboarding Video System

This module implements a video-based onboarding system for applicants with sequential video watching validation.

## Features

- **Sequential Video Watching**: Users must complete videos in order (1 → 2 → 3 → 4)
- **Progress Tracking**: Real-time tracking of video watch progress
- **Validation**: Users must watch at least 90% of each video to unlock the next one
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

### Option 1: Supabase Storage (Recommended)

1. Create a storage bucket named `onboarding-videos` in Supabase
2. Upload your 4 videos with the following naming convention:
   - `onboarding-1.mp4` - Introduction
   - `onboarding-2.mp4` - Company Culture
   - `onboarding-3.mp4` - Tools & Processes
   - `onboarding-4.mp4` - Getting Started

3. Update the `VIDEO_URLS` in `_components/OnboardingClient.tsx`:
```typescript
const VIDEO_URLS = {
  1: "https://your-project.supabase.co/storage/v1/object/public/onboarding-videos/onboarding-1.mp4",
  2: "https://your-project.supabase.co/storage/v1/object/public/onboarding-videos/onboarding-2.mp4",
  3: "https://your-project.supabase.co/storage/v1/object/public/onboarding-videos/onboarding-3.mp4",
  4: "https://your-project.supabase.co/storage/v1/object/public/onboarding-videos/onboarding-4.mp4",
};
```

### Option 2: Public Folder

1. Create a `public/videos` folder in the root of your Next.js app
2. Add your 4 videos with the naming convention above
3. The current URLs in `OnboardingClient.tsx` are already configured for this option

### Option 3: External Video Hosting

Use any video hosting service (Vimeo, YouTube, AWS S3, etc.) and update the URLs accordingly.

## Flow

1. **Applicant Step 3** (`/applicant/waiting`):
   - When user status is "onboarding" and they've joined Discord
   - "Start Onboarding" button appears
   - Clicking routes to `/applicant/onboarding`

2. **Video Watching** (`/applicant/onboarding` - Step 1-4):
   - Shows progress stepper with 5 steps
   - Displays current video with player controls
   - Tracks watch progress (must watch 90%+ to complete)
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
- HTML5 video controls
- Progress tracking
- Watch validation (90% threshold)
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
// Current: 90% threshold
if (percentWatched >= 90 && !hasWatched) {
  // Change 90 to your desired percentage
}
```

### Styling
All components use Tailwind CSS and can be customized by modifying the className properties.

## Security Features

- Row Level Security (RLS) policies ensure users can only access their own progress
- Video right-click disabled to prevent easy downloading
- Download controls disabled
- Progress validation on server-side

## Troubleshooting

### Videos not loading
- Check video URLs in `VIDEO_URLS`
- Ensure videos are in correct format (MP4 recommended)
- Check browser console for network errors
- Verify Supabase storage bucket permissions (if using Supabase)

### Progress not saving
- Check database connection
- Verify `onboarding_videos` table exists
- Check browser console for errors
- Ensure applicant_id is valid

### User can't access onboarding page
- Verify user's `application_status` is "onboarding"
- Check if user has joined Discord (checkbox must be checked)
- Verify applicant record exists in database
