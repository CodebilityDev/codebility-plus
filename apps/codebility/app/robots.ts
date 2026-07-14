import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            // Block internal authenticated app routes from Google
            disallow: ["/home/", "/auth/", "/api/"],
        },
        sitemap: "https://www.codebility.tech/sitemap.xml",
    };
}