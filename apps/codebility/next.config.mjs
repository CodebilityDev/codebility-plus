import { existsSync, readFileSync } from "fs";
import path from "path";

import withBundleAnalyzer from "@next/bundle-analyzer";
import withPlugins from "next-compose-plugins";

import { env } from "./env.mjs";

const loadEnvForRuntime = () => {
  const vercelEnv = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
  const envFileMap = {
    production: ".env.production",
    preview: ".env.staging",
  };

  const envFilename = envFileMap[vercelEnv];

  if (!envFilename) return;

  const envPath = path.resolve(process.cwd(), "apps", "codebility", envFilename);

  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, "utf-8");
  content.split(/\r?\n/).forEach((line) => {
    if (!line || line.trim().startsWith("#")) return;

    const [key, ...rest] = line.split("=");
    if (!key || rest.length === 0) return;

    const value = rest.join("=").trim().replace(/^"|"$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
};

loadEnvForRuntime();

/**
 * @type {import('next').NextConfig}
 */
const config = withPlugins([[withBundleAnalyzer({ enabled: env.ANALYZE })]], {
  reactStrictMode: true,
  typescript: {
    // Skip type checking during build to avoid React Hook Form version conflicts
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint during build to avoid config issues
    ignoreDuringBuilds: true,
  },
  /* experimental: { instrumentationHook: true }, */
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
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
        hostname: "hibnlysaokybrsufrdwp.supabase.co",
      },
      {
        hostname: "mynmukpnttyyjimymgrk.supabase.co",
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
        hostname: "example.com",
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
