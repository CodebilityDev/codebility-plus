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

    // Clear applicants cache
    const applicantsKey = "cache:codevs:applicants";
    await redis.del(applicantsKey);

    // Clear in-house cache
    const inhouseKey = "cache:codevs:inhouse";
    await redis.del(inhouseKey);

    // Clear all codevs cache
    const codevsKey = "cache:codevs:codevs.all";
    await redis.del(codevsKey);

    // Clear dashboard cache
    const dashboardKey = "cache:dashboard:admin";
    await redis.del(dashboardKey);

    await redis.quit();
  } catch (error) {
    process.exit(1);
  }
}

clearCache();