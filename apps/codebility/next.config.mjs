import withBundleAnalyzer from "@next/bundle-analyzer";
import withPlugins from "next-compose-plugins";

import { env } from "./env.mjs";

/**
 * @type {import('next').NextConfig}
 */
const config = withPlugins([[withBundleAnalyzer({ enabled: env.ANALYZE })]], {
  reactStrictMode: true,
  /* experimental: { instrumentationHook: true }, */
  images: {
    remotePatterns: [
      {
        hostname: "kdkuljweiqtiveqvqirw.supabase.co",
      },
      {
        hostname: "nwpvsxbrftplvebseaas.supabase.co",
      },
      {
        hostname: "qqjfmtpmprefkqneerkg.supabase.co",
      },
      {
        hostname: "qwmazrujcjuhhdipnywa.supabase.co",
      },
      {
        hostname:
          process.env.NEXT_PUBLIC_SUPBASE_HOST ??
          "kdkuljweiqtiveqvqirw.supabase.co",
      },
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "codebility-cdn.pages.dev",
      },

      {
        protocol: "https",
        hostname:
          (process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_URL.split("https://")[1]) ??
          "https://nwpvsxbrftplvebseaas.supabase.co",
      },
    ],
  },

  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
});

export default config;
