import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.DB_SERVICE_ROLE!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing required environment variables");
  process.exit(1);
}

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigrations() {
  const migrationsDir = join(process.cwd(), "supabase", "migrations");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort(); // Ensure migrations run in order

  console.log(`Found ${files.length} migration files`);

  for (const file of files) {
    console.log(`\nRunning migration: ${file}`);
    const sql = readFileSync(join(migrationsDir, file), "utf-8");

    try {
      const { error } = await supabase.rpc("exec_sql", { sql_query: sql });

      if (error) {
        // If exec_sql doesn't exist, try direct SQL execution
        console.log("Trying alternative method...");
        const lines = sql.split(";").filter((line) => line.trim());

        for (const line of lines) {
          if (line.trim()) {
            const { error: execError } = await supabase
              .from("_migrations")
              .select("*")
              .limit(0); // Just test connection

            // Execute via raw query if available
            console.log("Warning: Cannot execute migration programmatically");
            console.log(
              "Please run migrations manually using Supabase SQL Editor or CLI",
            );
            console.log("\nMigration content:");
            console.log(sql);
            break;
          }
        }

        if (error) {
          console.error(`Error in ${file}:`, error.message);
        }
      } else {
        console.log(`✓ ${file} completed successfully`);
      }
    } catch (err) {
      console.error(`Failed to run ${file}:`, err);
    }
  }

  console.log("\nMigration process completed");
}

runMigrations();
