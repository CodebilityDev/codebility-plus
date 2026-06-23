# Onboarding Video Guide

This guide explains how to manage the applicant onboarding videos.

> **⚠️ Do NOT host these videos on Supabase Storage.**
> Onboarding videos were migrated **off** Supabase Storage to **unlisted YouTube**
> because video streaming generated very high Supabase *cached egress*, which
> repeatedly tripped the Fair Use Policy and restricted the entire project
> (all services returning HTTP 402/500). YouTube serves the video bandwidth for
> free, so this class of outage can't happen again. Keep it that way.

## Current Video Configuration

Videos are **unlisted YouTube videos**. The app embeds them with the YouTube
IFrame Player API and is referenced by **video ID** (not URL), supplied via
environment variables:

| Env var | Video |
| --- | --- |
| `NEXT_PUBLIC_ONBOARDING_VIDEO_ID_1` | Introduction - About Codebility |
| `NEXT_PUBLIC_ONBOARDING_VIDEO_ID_2` | Benefits, Culture & Expectations |
| `NEXT_PUBLIC_ONBOARDING_VIDEO_ID_3` | Roadmaps, Milestones & Tech Stack |
| `NEXT_PUBLIC_ONBOARDING_VIDEO_ID_4` | Portal Tour - Gamification & Workflow |

A YouTube video ID is the part after `watch?v=` or `youtu.be/`. For
`https://youtu.be/jUQ0cvJnEGg`, the ID is `jUQ0cvJnEGg`.

These env vars are read in
`apps/codebility/app/applicant/onboarding/_components/OnboardingClient.tsx`
(`VIDEO_IDS`). The player itself lives in `_components/VideoPlayer.tsx`.

## How to upload / replace a video

1. Sign in to YouTube with the **Codebility** account.
2. **Upload video** → select the MP4.
3. Audience: **"No, it's not made for kids."**
4. Visibility: **Unlisted** — ⚠️ **not Private** (Private videos cannot be embedded).
5. Confirm **"Allow embedding"** is enabled (Advanced settings; it is on by default).
6. Publish, then copy the video ID from its URL.
7. Update the matching `NEXT_PUBLIC_ONBOARDING_VIDEO_ID_*` env var in:
   - `apps/codebility/.env.local` (local dev)
   - `apps/codebility/.env.production`
   - Your hosting provider's env settings (Vercel/Railway/etc.)
8. **Redeploy.** `NEXT_PUBLIC_*` vars are inlined at **build time**, so the
   production app only picks up changes after a rebuild.

No code change is required to swap a video — only the env var value.

### Verifying a video is embeddable

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://www.youtube.com/oembed?url=https://youtu.be/VIDEO_ID&format=json"
```

`200` = embeddable. Anything else (e.g. `401`/`403`) usually means the video is
Private or embedding is disabled.

## Video File Specifications (for the YouTube source upload)

- **Format**: MP4 (H.264 video / AAC audio)
- **Resolution**: 1080p (1920x1080) or 720p (1280x720)
- **Frame Rate**: 30fps

YouTube handles transcoding and adaptive streaming after upload, so you no longer
need to hand-optimize bitrate/`faststart` for delivery.

## Progress Tracking

Watch progress is still tracked in the app's own Supabase database
(`onboarding_videos` table) by `video_number` (1–4) — **not** by video URL.
The player marks a video complete once **98%** is watched and calls the
`updateVideoProgress` server action. Moving the video host does not affect this.

## Troubleshooting

### Video doesn't load / shows the error overlay
1. Confirm the env var holds a **video ID**, not a full URL.
2. Confirm the YouTube video is **Unlisted** (not Private) and embedding is allowed.
3. In production, confirm you **redeployed** after setting the env vars.
4. Check the browser console for IFrame API errors.

### Progress not saving
1. Check the Supabase DB connection.
2. Verify the `onboarding_videos` table exists.
3. Ensure `applicant_id` is valid.

## Cost / Egress Note

Hosting onboarding videos on Supabase Storage is what caused the
`exceed_cached_egress_quota` restriction. **Always host onboarding (and any other
large/streamed) videos on a dedicated video host (YouTube here).** If a future
requirement needs private/self-hosted video, prefer a zero-egress option such as
Cloudflare R2/Stream — never serve multi-GB video traffic from Supabase Storage.
