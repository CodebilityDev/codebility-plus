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
    title: "Your App",
    description: "Your app description here",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.className}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        (function() {
          const savedTheme = localStorage.getItem('theme');
          // Use dark as default if no theme is saved
          const theme = savedTheme || 'dark';
          document.documentElement.classList.add(theme);
          if (!savedTheme) {
            localStorage.setItem('theme', 'dark');
          }
        })();
      `,
          }}
        />
      </head>
      <body>
        <ReactQueryProvider>
          <ThemeProvider>
            <ToasterContext />
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
