import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Redis from "ioredis";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(dirname(__dirname), ".env.local") });

const REDIS_URL = process.env.REDIS_URL;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

async function clearCache() {
  if (!REDIS_URL || !REDIS_PASSWORD) {
    console.log("❌ Redis not configured. No cache to clear.");
    console.log("   This is okay - the app will fetch fresh data from the database.");
    return;
  }

  try {
    const redis = new Redis(
      `redis://:${REDIS_PASSWORD}@${REDIS_URL}`,
      {
        connectTimeout: 5000,
        maxRetriesPerRequest: 1,
      }
    );

    console.log("🔄 Clearing cache...\n");

    // Clear applicants cache
    const applicantsKey = "cache:codevs:applicants";
    await redis.del(applicantsKey);
    console.log(`✅ Cleared: ${applicantsKey}`);

    // Clear in-house cache
    const inhouseKey = "cache:codevs:inhouse";
    await redis.del(inhouseKey);
    console.log(`✅ Cleared: ${inhouseKey}`);

    // Clear all codevs cache
    const codevsKey = "cache:codevs:codevs.all";
    await redis.del(codevsKey);
    console.log(`✅ Cleared: ${codevsKey}`);

    // Clear dashboard cache
    const dashboardKey = "cache:dashboard:admin";
    await redis.del(dashboardKey);
    console.log(`✅ Cleared: ${dashboardKey}`);

    console.log("\n✨ Cache cleared successfully!");

    await redis.quit();
  } catch (error) {
    console.error("❌ Error clearing cache:", error);
    process.exit(1);
  }
}

clearCache();
