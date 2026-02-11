/**
 * Utility script to find and revert incorrectly accepted applicants
 *
 * Usage: pnpm tsx apps/codebility/fix-applicants.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.DB_SERVICE_ROLE!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   DB_SERVICE_ROLE:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findRecentlyAcceptedApplicants() {
  console.log('🔍 Finding recently accepted applicants...\n');

  // Get applicants who were recently moved to "passed" status
  // Focusing on those accepted in the last 24 hours
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  const { data: applicants, error } = await supabase
    .from('codev')
    .select('id, first_name, last_name, email_address, application_status, date_joined, updated_at')
    .eq('application_status', 'passed')
    .gte('date_joined', oneDayAgo.toISOString())
    .order('date_joined', { ascending: false });

  if (error) {
    console.error('❌ Error fetching applicants:', error);
    return;
  }

  if (!applicants || applicants.length === 0) {
    console.log('✅ No recently accepted applicants found.');
    return;
  }

  console.log(`📋 Found ${applicants.length} recently accepted applicants:\n`);

  applicants.forEach((applicant, index) => {
    console.log(`${index + 1}. ${applicant.first_name} ${applicant.last_name}`);
    console.log(`   Email: ${applicant.email_address}`);
    console.log(`   Accepted: ${new Date(applicant.date_joined).toLocaleString()}`);
    console.log(`   ID: ${applicant.id}\n`);
  });

  return applicants;
}

async function revertApplicantsToWaitlist(applicantIds: string[]) {
  console.log(`\n🔄 Reverting ${applicantIds.length} applicants back to waitlist...\n`);

  const { error } = await supabase
    .from('codev')
    .update({
      application_status: 'waitlist',
      role_id: 3, // Applicant role
      date_joined: null,
      updated_at: new Date().toISOString()
    })
    .in('id', applicantIds);

  if (error) {
    console.error('❌ Error reverting applicants:', error);
    return false;
  }

  console.log('✅ Successfully reverted applicants to waitlist status!');
  return true;
}

// Main execution
async function main() {
  console.log('🚀 Starting applicant recovery process...\n');

  const applicants = await findRecentlyAcceptedApplicants();

  if (!applicants || applicants.length === 0) {
    return;
  }

  console.log('\n⚠️  REVERTING INCORRECTLY ACCEPTED APPLICANTS ⚠️\n');

  // Revert only the 5 incorrectly accepted applicants (keeping Bon Jury, Gerald, and Ahliesa)
  const incorrectlyAcceptedIds = [
    '19d09872-ce66-4882-aa26-b2d5362069f9', // Ian Macalinao
    '2c4c071e-fc65-44c5-bca7-8ba8d312be95', // Romolo Jr Tacmoy
    '4e76b9d9-9b12-40f0-b955-60348f09d32a', // Jan Wayne Sepe
    '8e3d13be-380c-49ac-bd02-5147f46685c4', // Emmanuel Mingala
    'b1a5fe82-bf80-4a1e-aa92-48cd11219ed7', // Jude Janculan
  ];

  await revertApplicantsToWaitlist(incorrectlyAcceptedIds);
}

main();
