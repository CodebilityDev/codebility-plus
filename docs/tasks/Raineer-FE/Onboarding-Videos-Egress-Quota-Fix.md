# Onboarding Videos — Storage Egress Quota Fix

## Summary

Our Supabase organization (Codebility) blew past its **Cached egress (bandwidth)** quota for the billing cycle — **354.83 GB used against a 275 GB included allowance** — which caused Supabase to **restrict the whole project**: API, Auth, and Storage requests were dropped (returning `500 ... exceed_cached_egress_quota`), so users could not even log in. Only the Supabase dashboard stayed accessible.

The root cause is the **applicant onboarding videos**. The four videos (`part1.mp4`–`part4.mp4`, ~5.8 GB total, with `part1.mp4` alone ~716 MB) are served directly from a **public Supabase Storage bucket** and the player uses **`preload="auto"`**, so the browser starts downloading the entire video the moment the onboarding screen mounts — before the user even presses play. Combined with full re-downloads on retry/navigation and a public, scrape-able bucket, this single feature is responsible for the bulk of the egress.

This task stops the bleeding (so login/service can't be taken down by video bandwidth again) and moves video delivery off Supabase egress for good. **It does not touch auth logic, data models, or server actions** — it's contained to the onboarding video delivery layer plus a hosting/bucket change.

## Technical Context

Confirmed by inspecting the code:

- **`apps/codebility/app/applicant/onboarding/_components/OnboardingClient.tsx:19-24`** — `VIDEO_URLS` hardcodes four public Storage URLs:
  `https://hibnlysaokybrsufrdwp.supabase.co/storage/v1/object/public/codebility/onboarding-videos/partN.mp4`
- **`apps/codebility/app/applicant/onboarding/_components/VideoPlayer.tsx:191-202`** — renders a native `<video preload="auto">` with `<source src={videoUrl}>`. The inline comment literally says *"Start loading immediately"* — this is what triggers a full-file download on mount, watched or not.
- **`apps/codebility/app/applicant/onboarding/_components/VideoPlayer.tsx:156-162`** — `handleRetry()` calls `videoRef.current.load()`, which **restarts the download from zero**. Once quota errors began, users hitting "Retry" each re-pulled the whole file — a feedback loop that accelerated egress.
- File sizes per `apps/codebility/docs/VIDEO_UPLOAD_GUIDE.md` — `part1.mp4 ~716 MB`; four parts ~5.8 GB.
- The `codebility` Storage bucket is **public**, and the URLs are static/hardcoded, so bots or any leaked link can pull GBs with no auth.
- "Cached egress" on Supabase = **Storage CDN bandwidth**. Database/REST egress is a separate line, so the overage is overwhelmingly Storage downloads → the videos.

Math sanity-check: 354 GB ÷ 5.8 GB ≈ ~61 full download sets. With `preload="auto"`, you don't need 61 completed onboardings — just that many page visits + retries + back/forward navigations, each pulling a large chunk. Entirely consistent with the videos being the cause.

## Objectives

1. **Immediate mitigation (highest priority, ship first):**
   - Change the player from `preload="auto"` to **`preload="none"`** (or `"metadata"` if a poster/duration is needed). The video must download **only after the user clicks play**, never on mount.
   - Fix `handleRetry()` so it does not restart a full download unnecessarily (only reload when the source genuinely errored, and prefer resuming over restarting from zero).
2. **Move video delivery off Supabase egress (primary fix) — use Mux:**
   - **Re-host the four onboarding videos on [Mux](https://www.mux.com/) using its free plan** (at time of writing: up to **10 on-demand videos** and **100,000 delivery minutes/month** free, no credit card). We only have 4 videos, so this should be **$0/month** and takes video bandwidth fully off Supabase. **Verify the current free-plan limits at signup before building on them** — provider free tiers change.
   - **Why Mux over the alternatives:** Mux gives an **HLS URL that drops into the existing native `<video src>`**, so the current watch-completion / sequential-unlock logic (driven by native `<video>` `timeupdate`/`ended` events) keeps working with minimal change. It also does adaptive bitrate, so users no longer pull the full 716 MB file.
   - **Fallbacks if Mux doesn't fit:**
     - **Bunny Stream** — if we ever exceed Mux's 10-video free cap. Not free (≈$1/month minimum + low bandwidth) but very cheap; also HLS-based, so the same minimal player change applies.
     - **Unlisted YouTube/Vimeo** — truly free with no API setup, BUT requires replacing the native `<video>` element with the provider's **iframe embed** and **rewriting progress tracking against the YouTube IFrame Player API**, and inherits provider branding ("Watch on YouTube", logo) plus video-unavailable risk. Choose this only if zero hosting setup outweighs the extra player rework. **Do NOT use Cloudflare Stream** — no free tier, $5/month floor.
   - Replace the hardcoded `VIDEO_URLS` with the new host's URLs (ideally via env vars / config, not hardcoded literals).
3. **Reduce file size regardless of host:**
   - Re-encode the videos (H.264/H.265, 720p, sane bitrate). 716 MB for one onboarding clip is far too high; expect a 5–10× reduction.
4. **Lock down the source bucket (if any video stays on Supabase):**
   - Make the bucket private and serve via **signed URLs** with a short TTL, so the files can't be scraped by bots or shared links.

## Expected Behavior

- Visiting the onboarding screen (`/applicant/onboarding`) downloads **no video bytes** until the user actually presses play on a given video.
- Navigating between video steps or retrying a failed load does **not** trigger a fresh full-file download.
- Videos play correctly through the onboarding flow, and the existing watch-completion / sequential-unlock logic still works (do not regress the 90% completion gating).
- Video bandwidth no longer counts against Supabase Cached egress (or is drastically reduced if any file remains on Supabase).

## Acceptance Criteria

- `VideoPlayer.tsx` no longer uses `preload="auto"`; verified in the browser **Network tab** that loading the onboarding page issues **no large video request** until play is pressed.
- Retry/navigation no longer re-downloads the entire file from zero (verified in Network tab).
- The four videos are served from **Mux** (or an approved fallback / signed private Storage URLs); `VIDEO_URLS` no longer points at the public `…/object/public/…` Supabase path (or, if interim, is behind signed URLs).
- Re-encoded files are meaningfully smaller (document before/after sizes in the PR).
- Onboarding still functions end-to-end: all four videos play, completion tracking and sequential unlocking work, quiz/commitment steps unaffected.
- PR includes Network-tab before/after evidence (no video bytes on mount) and the new total egress footprint estimate.

## Implementation Notes (Mux)

Concrete steps for the recommended Mux path:

1. **Create the Mux account & assets**
   - Sign up at [mux.com](https://www.mux.com/) and confirm the **free plan limits still apply** (≤10 videos, 100k delivery min/mo at time of writing).
   - Download the current source files from **Supabase Dashboard → Storage → `codebility/onboarding-videos`** (dashboard works even while the project is restricted).
   - **(Recommended) re-encode first** (H.264, 720p, sane bitrate) — 716 MB per clip is far too high — then upload the four files to Mux. Upload via the Mux dashboard, the [direct-upload](https://www.mux.com/docs) flow, or the API.
   - For each asset, grab its **Playback ID** and build the HLS URL: `https://stream.mux.com/{PLAYBACK_ID}.m3u8`.

2. **Wire the URLs through config, not hardcoded literals**
   - Replace the hardcoded `VIDEO_URLS` in `OnboardingClient.tsx:19-24` with the four Mux HLS URLs.
   - Prefer env vars (e.g. `NEXT_PUBLIC_ONBOARDING_VIDEO_1` … `_4`) or a config object so the URLs aren't baked into the component. Add them to `.env.local` and the app's env example file.

3. **⚠️ HLS playback gotcha — the most important step**
   - A native `<video><source src="….m3u8" type="application/x-mpegURL"></video>` plays HLS **only in Safari/iOS**. **Chrome, Edge, and Firefox do NOT play `.m3u8` natively** — the current `VideoPlayer.tsx` would just error there.
   - Fix: add **[`hls.js`](https://github.com/video-dev/hls.js)** (`pnpm add hls.js` in `apps/codebility`). In `VideoPlayer.tsx`, attach it to the `videoRef`:
     ```tsx
     import Hls from "hls.js";
     // inside an effect, after the <video> ref is available:
     const video = videoRef.current;
     if (video.canPlayType("application/vnd.apple.mpegurl")) {
       video.src = videoUrl;                 // Safari plays HLS natively
     } else if (Hls.isSupported()) {
       const hls = new Hls();
       hls.loadSource(videoUrl);
       hls.attachMedia(video);
       // remember to hls.destroy() on cleanup / videoUrl change
     }
     ```
   - Keep using the **native `<video>` element** so the existing `timeupdate` / `ended` / `loadedmetadata` handlers that drive the 90% completion gate and sequential unlock continue to work unchanged. `hls.js` feeds the same `<video>`, so those events still fire.
   - Replace `preload="auto"` with `preload="none"` (Objective 1) — with `hls.js` you control load timing explicitly, so don't start the HLS load until the user presses play.
   - Alternatively, the official **`@mux/mux-player-react`** component bundles HLS handling and emits standard media events — simpler, but it's a larger swap of the player UI; using `hls.js` with the existing `<video>` is the lower-risk change.

4. **Verify**
   - In the browser **Network tab**: loading `/applicant/onboarding` pulls **no video segments** until play is pressed; playback then streams `.ts`/segment requests from `stream.mux.com` (not Supabase).
   - Test in **Chrome AND Safari** (HLS behaves differently across them).
   - Re-confirm the **90% watch-completion gate** and **sequential unlock** still work, and that retry/navigation don't restart full downloads.

## Reminders

- **Do not change** auth, middleware, data models, or server actions — this is the video delivery layer only. The login failures were a *symptom* of the quota, not a code bug; they resolve once egress is under control.
- Confirm the cause first via **Supabase Dashboard → Reports/Usage → Egress** (Storage/Cached egress breakdown) and **Storage Logs** (repeated `GET …/onboarding-videos/partN.mp4`) before and after the fix, and include those numbers in the PR.
- Keep the watch-completion threshold and sequential-unlock behavior intact — re-test them after swapping the player/source.
- Download the current videos from **Supabase Dashboard → Storage → `codebility/onboarding-videos`** (dashboard access works even while restricted) to re-encode/re-host them.
- Coordinate the actual file re-host/upload and any bucket privacy change with the team lead (credentials/access to the Mux account or chosen host).
- If you switch to an iframe-based fallback (YouTube/Vimeo), budget extra time to rewrite the watch-completion tracking against the provider's player API and re-verify the 90% gate — this is why Mux (native `<video>`) is the default.

## Instructions

- Branch naming: `onboarding-video-egress/your-name`. Commit all changes to this branch before opening the PR.
- Ship the **`preload` mitigation as a small first commit/PR** if the re-hosting will take longer — it's the highest-impact, lowest-risk change and prevents a repeat outage.
- Include a comprehensive PR description: files touched, the new host, before/after file sizes, before/after Network-tab screenshots, and the Usage Dashboard egress reading.
- Request review from your team lead. Maintain Kanban card status as work progresses.

## Got any questions?

Reach out to your assigned team lead via the team group chat.
