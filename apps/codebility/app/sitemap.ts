import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://www.codebility.tech";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Use anon client — public data, no auth required
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Fetch all public codev IDs for dynamic profile routes
    const { data: codevs } = await supabase
        .from("codev")
        .select("id, updated_at")
        .eq("application_status", "passed");

    // Static marketing pages
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
        { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE_URL}/hire-a-codev`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
        { url: `${BASE_URL}/codevs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
        { url: `${BASE_URL}/ai-integration`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
        { url: `${BASE_URL}/bookacall`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.6 },
        { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
        { url: `${BASE_URL}/profiles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    ];

    // Dynamic profile pages — one entry per codev
    const profileRoutes: MetadataRoute.Sitemap = (codevs ?? []).map((codev) => ({
        url: `${BASE_URL}/profiles/${codev.id}`,
        lastModified: codev.updated_at ? new Date(codev.updated_at) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
    }));

    return [...staticRoutes, ...profileRoutes];
}