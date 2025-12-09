/**
 * Script to reset onboarding video progress for an applicant
 * Usage: tsx scripts/reset-video-progress.ts <applicant_id>
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

const APPLICANT_ID = process.argv[2] || 'ce18a735-360b-49b8-84ef-d16aa675bfad';

async function resetVideoProgress() {
  // Check for required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.DB_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - DB_SERVICE_ROLE or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Create Supabase client with service role key for admin access
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log(`🔄 Resetting video progress for applicant: ${APPLICANT_ID}`);

  // First, check if the applicant exists
  const { data: applicant, error: applicantError } = await supabase
    .from('applicant')
    .select('id, codev_id')
    .eq('codev_id', APPLICANT_ID)
    .single();

  if (applicantError || !applicant) {
    console.error('❌ Applicant not found:', applicantError?.message);
    process.exit(1);
  }

  console.log('✅ Found applicant:', applicant.id);

  // Check current video progress
  const { data: currentProgress, error: fetchError } = await supabase
    .from('onboarding_videos')
    .select('*')
    .eq('applicant_id', applicant.id)
    .order('video_number');

  if (fetchError) {
    console.error('❌ Error fetching current progress:', fetchError.message);
    process.exit(1);
  }

  console.log('\n📊 Current video progress:');
  if (currentProgress && currentProgress.length > 0) {
    currentProgress.forEach((video) => {
      const watchPercentage = video.total_duration > 0
        ? Math.round((video.watched_duration / video.total_duration) * 100)
        : 0;
      console.log(`   Video ${video.video_number}: ${video.completed ? '✅ Completed' : '❌ Not completed'} (${watchPercentage}%)`);
    });
  } else {
    console.log('   No progress records found');
  }

  // Reset all video progress to false
  const { error: updateError } = await supabase
    .from('onboarding_videos')
    .update({
      completed: false,
      completed_at: null,
      watched_duration: 0,
      updated_at: new Date().toISOString()
    })
    .eq('applicant_id', applicant.id);

  if (updateError) {
    console.error('❌ Error resetting video progress:', updateError.message);
    process.exit(1);
  }

  // Verify the reset
  const { data: updatedProgress, error: verifyError } = await supabase
    .from('onboarding_videos')
    .select('*')
    .eq('applicant_id', applicant.id)
    .order('video_number');

  if (verifyError) {
    console.error('❌ Error verifying reset:', verifyError.message);
    process.exit(1);
  }

  console.log('\n✅ Video progress successfully reset!');
  console.log('\n📊 Updated video progress:');
  if (updatedProgress && updatedProgress.length > 0) {
    updatedProgress.forEach((video) => {
      const watchPercentage = video.total_duration > 0
        ? Math.round((video.watched_duration / video.total_duration) * 100)
        : 0;
      console.log(`   Video ${video.video_number}: ${video.completed ? '✅ Completed' : '❌ Not completed'} (${watchPercentage}%)`);
    });
  }

  // Also reset quiz and commitment fields in the applicant table
  console.log('\n🔄 Resetting quiz and commitment fields...');
  const { error: resetApplicantError } = await supabase
    .from('applicant')
    .update({
      quiz_score: 0,
      quiz_total: 0,
      quiz_passed: false,
      quiz_completed_at: null,
      signature_data: null,
      commitment_signed_at: null,
      can_do_mobile: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', applicant.id);

  if (resetApplicantError) {
    console.error('❌ Error resetting quiz/commitment fields:', resetApplicantError.message);
    process.exit(1);
  }

  console.log('✅ Quiz and commitment fields successfully reset!');
  console.log('\n✨ Done! The applicant can now:');
  console.log('   - Rewatch all onboarding videos');
  console.log('   - Retake the quiz');
  console.log('   - Re-sign the commitment');
}

resetVideoProgress().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
