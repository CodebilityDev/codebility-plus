# Onboarding Video Upload Guide

This guide explains how to upload and manage onboarding videos in Supabase Storage.

## Current Video Configuration

The onboarding videos are stored in Supabase Storage and accessed via public URLs:

- **Bucket**: `codebility`
- **Path**: `onboarding-videos/`
- **Files**: `part1.mp4`, `part2.mp4`, `part3.mp4`, `part4.mp4`

### Current Video URLs

```
https://hibnlysaokybrsufrdwp.supabase.co/storage/v1/object/public/codebility/onboarding-videos/part1.mp4
https://hibnlysaokybrsufrdwp.supabase.co/storage/v1/object/public/codebility/onboarding-videos/part2.mp4
https://hibnlysaokybrsufrdwp.supabase.co/storage/v1/object/public/codebility/onboarding-videos/part3.mp4
https://hibnlysaokybrsufrdwp.supabase.co/storage/v1/object/public/codebility/onboarding-videos/part4.mp4
```

## Uploading Videos via Supabase Dashboard

### Step 1: Access Supabase Storage

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Select the `codebility` bucket (or create it if it doesn't exist)

### Step 2: Create Folder (if needed)

1. Click **Create folder**
2. Name it `onboarding-videos`
3. Click **Create**

### Step 3: Upload Videos

1. Navigate into the `onboarding-videos` folder
2. Click **Upload file**
3. Select your video files:
   - `part1.mp4` - Introduction - About Codebility
   - `part2.mp4` - Benefits, Culture & Expectations
   - `part3.mp4` - Roadmaps, Milestones & Tech Stack
   - `part4.mp4` - Portal Tour - Gamification & Workflow
4. Click **Upload**

### Step 4: Make Files Public

1. For each uploaded file, click the **⋮** menu
2. Select **Get URL**
3. Toggle **Public** to ON
4. Copy the public URL

### Step 5: Update Video URLs (if needed)

If you upload to a different bucket or path, update the URLs in:

`apps/codebility/app/applicant/onboarding/_components/OnboardingClient.tsx`

```typescript
const VIDEO_URLS = {
  1: "https://YOUR_PROJECT.supabase.co/storage/v1/object/public/YOUR_BUCKET/YOUR_PATH/part1.mp4",
  2: "https://YOUR_PROJECT.supabase.co/storage/v1/object/public/YOUR_BUCKET/YOUR_PATH/part2.mp4",
  3: "https://YOUR_PROJECT.supabase.co/storage/v1/object/public/YOUR_BUCKET/YOUR_PATH/part3.mp4",
  4: "https://YOUR_PROJECT.supabase.co/storage/v1/object/public/YOUR_BUCKET/YOUR_PATH/part4.mp4",
};
```

## Uploading Videos via Supabase CLI

### Prerequisites

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login
```

### Upload Command

```bash
# Navigate to your project
cd apps/codebility

# Upload a single video
supabase storage upload codebility/onboarding-videos/part1.mp4 path/to/your/part1.mp4 --project-ref YOUR_PROJECT_REF

# Upload all videos
supabase storage upload codebility/onboarding-videos path/to/your/videos/*.mp4 --project-ref YOUR_PROJECT_REF
```

### Make Files Public via CLI

```bash
# Create a public bucket policy
supabase storage update codebility --public true --project-ref YOUR_PROJECT_REF
```

## Video File Specifications

### Recommended Settings

- **Format**: MP4 (H.264 codec)
- **Resolution**: 1080p (1920x1080) or 720p (1280x720)
- **Bitrate**: 2-5 Mbps for good quality
- **Audio**: AAC codec, 128-192 kbps
- **Frame Rate**: 30fps

### Current File Sizes

- part1.mp4: ~716 MB
- part2.mp4: ~2.4 GB
- part3.mp4: ~1.4 GB
- part4.mp4: ~1.3 GB
- **Total**: ~5.8 GB

### Size Optimization Tips

If you need to reduce file sizes:

1. **Use HandBrake or FFmpeg**:
   ```bash
   # Example with FFmpeg to reduce size while maintaining quality
   ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k output.mp4
   ```

2. **Recommended CRF values**:
   - 18-22: High quality (larger files)
   - 23-28: Good quality (balanced)
   - 28+: Lower quality (smaller files)

3. **Consider streaming optimization**:
   ```bash
   # Add web optimization flag
   ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart output.mp4
   ```

## Bucket Configuration

### Storage Policies

Ensure your Supabase Storage bucket has the correct RLS policies:

```sql
-- Allow public access to onboarding videos
CREATE POLICY "Public Access for Onboarding Videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'codebility' AND (storage.foldername(name))[1] = 'onboarding-videos');
```

### CORS Configuration

If videos don't play due to CORS issues:

1. Go to **Settings** → **API** in Supabase Dashboard
2. Add your application domain to **CORS allowed origins**
3. Include both development and production URLs:
   - `http://localhost:3000`
   - `https://www.codebility.tech`

## Troubleshooting

### Videos Not Playing

1. **Check public access**: Ensure files are set to public in Supabase Storage
2. **Verify URLs**: Make sure URLs in code match actual storage paths
3. **Browser console**: Check for CORS errors or 404s
4. **File format**: Ensure videos are in MP4 format with H.264 codec

### Slow Loading

1. **Enable CDN**: Supabase uses CloudFlare CDN automatically for public storage
2. **Optimize video files**: Use the compression tips above
3. **Consider adaptive streaming**: For very large files, consider HLS or DASH streaming

### Upload Failures

1. **File size limits**: Check your Supabase plan's storage limits
2. **Timeout issues**: For large files, use the CLI instead of dashboard
3. **Network stability**: Ensure stable internet connection during upload

## Updating Videos

When you need to replace a video:

1. Upload the new video with the same filename
2. Supabase will automatically overwrite the old version
3. No code changes needed if filename stays the same
4. Old URLs will automatically serve the new video

## Best Practices

1. **Name consistently**: Use descriptive, sequential names (part1, part2, etc.)
2. **Optimize before upload**: Compress videos before uploading to save storage space
3. **Test after upload**: Always verify videos play correctly after uploading
4. **Backup originals**: Keep original high-quality versions as backups
5. **Version control**: If you need to keep multiple versions, use folders like `v1/`, `v2/`

## Cost Considerations

Supabase Storage pricing (as of 2024):
- **Free tier**: 1 GB storage
- **Pro tier**: 100 GB storage included
- **Additional**: $0.021 per GB/month

Current videos (~5.8 GB) will use:
- Pro tier: Covered under 100 GB limit
- Additional cost: ~$0.12/month if over free tier

## Security Notes

- Videos are public and can be accessed by anyone with the URL
- Do not include sensitive information in videos
- Consider watermarking videos if needed
- Monitor storage bucket for unauthorized uploads
