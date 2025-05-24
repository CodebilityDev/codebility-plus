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

  webpack(config, options) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: "@svgr/webpack", options: { icon: true } }],
    });

    return config;
  },
});

export default config;
