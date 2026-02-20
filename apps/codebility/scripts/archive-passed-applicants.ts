import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(dirname(__dirname), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function archivePassedApplicants() {
  try {
    console.log("🔍 Finding applicants with 'passed' status...\n");

    // Find all codevs with passed status that still have applicant records
    const { data: passedCodevs, error: fetchError } = await supabase
      .from("codev")
      .select(`
        id,
        first_name,
        last_name,
        email_address,
        application_status,
        applicant (
          id,
          codev_id
        )
      `)
      .eq("application_status", "passed")
      .not("applicant", "is", null);

    if (fetchError) {
      console.error("❌ Error fetching passed codevs:", fetchError);
      return;
    }

    if (!passedCodevs || passedCodevs.length === 0) {
      console.log("✅ No applicant records found for passed codevs. Database is clean!");
      return;
    }

    console.log(`📋 Found ${passedCodevs.length} passed codev(s) with applicant records:\n`);

    for (const codev of passedCodevs) {
      console.log(`   - ${codev.first_name} ${codev.last_name} (${codev.email_address})`);
    }

    console.log("\n🗄️  These applicant records will be archived automatically by the database trigger.");
    console.log("   The trigger activates when application_status is updated.");
    console.log("\n💡 To manually trigger the archive, you can run:");
    console.log("   UPDATE codev SET application_status = 'passed' WHERE application_status = 'passed';");
    console.log("\n   Or delete the applicant records directly (they're already 'passed'):");

    for (const codev of passedCodevs) {
      if (codev.applicant) {
        const { error: deleteError } = await supabase
          .from("applicant")
          .delete()
          .eq("codev_id", codev.id);

        if (deleteError) {
          console.error(`   ❌ Failed to delete applicant for ${codev.email_address}:`, deleteError);
        } else {
          console.log(`   ✅ Deleted applicant record for ${codev.first_name} ${codev.last_name}`);
        }
      }
    }

    console.log("\n✨ Cleanup complete!");

  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

archivePassedApplicants();
