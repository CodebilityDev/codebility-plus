import { existsSync, readFileSync } from "fs";
import path from "path";

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
const config = {
  cacheComponents: true,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
  images: {
    remotePatterns: [
      { hostname: "kdkuljweiqtiveqvqirw.supabase.co" },
      { hostname: "nwpvsxbrftplvebseaas.supabase.co" },
      { hostname: "qqjfmtpmprefkqneerkg.supabase.co" },
      { hostname: "qwmazrujcjuhhdipnywa.supabase.co" },
      { hostname: "hibnlysaokybrsufrdwp.supabase.co" },
      { hostname: "mynmukpnttyyjimymgrk.supabase.co" },
      { hostname: "res.cloudinary.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "codebility-cdn.pages.dev" },
      { hostname: "example.com" },
      {
        protocol: "https",
        hostname:
          (process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_URL.split("https://")[1]) ??
          "https://nwpvsxbrftplvebseaas.supabase.co",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default config;