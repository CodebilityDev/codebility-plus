import "@/app/globals.css";

import React from "react";
import { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeProvider";
import ToasterContext from "@/context/ToasterProvider";
import ReactQueryProvider from "@/hooks/reactQuery";

const outfit = Outfit({
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
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
      <body>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ToasterContext />
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
