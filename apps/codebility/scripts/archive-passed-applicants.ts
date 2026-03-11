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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function archivePassedApplicants() {
  try {

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
      return;
    }

    if (!passedCodevs || passedCodevs.length === 0) {
      return;
    }

    for (const codev of passedCodevs) {
      if (codev.applicant) {
        const { error: deleteError } = await supabase
          .from("applicant")
          .delete()
          .eq("codev_id", codev.id);

        if (deleteError) {
          // handle error if needed
        }
      }
    }

  } catch (error) {
    process.exit(1);
  }
}

archivePassedApplicants();