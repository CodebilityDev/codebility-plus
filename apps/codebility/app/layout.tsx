import "@/app/globals.css";

import React from "react";
import { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/ThemeProvider";
import ToasterContext from "@/context/ToasterProvider";
import ReactQueryProvider from "@/hooks/reactQuery";
import { TooltipProvider } from "@codevs/ui/tooltip";
import JsonLd from "@/app/(marketing)/_components/JsonLd";

const outfit = Outfit({
    subsets: ["latin"],
    preload: false,
});

// CBP-135 follow-up: sitewide Organization + WebSite JSON-LD.
// Static schema — no data dependency, safe to render on every page.
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Codebility",
    url: "https://www.codebility.tech",
    logo: "https://www.codebility.tech/assets/images/logo.png",
    description: "Everyone has the ability to code",
};

const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Codebility",
    url: "https://www.codebility.tech",
};

export async function generateMetadata(): Promise<Metadata> {
    return {
        // CBP-135 follow-up fix: metadataBase was missing on dev, confirmed via
        // pasted layout.tsx. Required so relative OG image paths (/og-image.jpg)
        // resolve correctly in social previews.
        metadataBase: new URL("https://www.codebility.tech"),
        title: "Codebility",
        description: "Everyone has the ability to code",
        icons: {
            icon: [
                { url: "/favicon.ico" },
                { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
                { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            ],
            apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
            other: [
                { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" },
            ],
        },
        manifest: "/site.webmanifest",
        openGraph: {
            title: "Codebility",
            description: "Everyone has the ability to code",
            url: "https://www.codebility.tech/",
            siteName: "Codebility",
            images: [
                {
                    url: "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: "Codebility Logo",
                },
            ],
            type: "website",
        },
    };
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={outfit.className} suppressHydrationWarning>
            <head>
                {/*  <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  // Use dark as default if no theme is saved
                  const theme = savedTheme || 'dark';
                  document.documentElement.classList.add(theme);
                  if (!savedTheme) {
                    localStorage.setItem('theme', 'dark');
                  }
                } catch (e) {
                  // Fall back to dark theme if localStorage is not available
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        /> */}
            </head>
            <body suppressHydrationWarning>
                <JsonLd data={organizationSchema} />
                <JsonLd data={websiteSchema} />
                <ReactQueryProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <TooltipProvider>
                            <Toaster />
                            <ToasterContext />
                            {children}
                        </TooltipProvider>
                    </ThemeProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
