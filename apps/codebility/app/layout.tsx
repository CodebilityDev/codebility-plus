import "@/app/globals.css";

import React from "react";
import { Metadata } from "next";
import { Outfit } from "next/font/google";
import { headers } from "next/headers";
import { ModalProvider } from "@/Components/providers/modal-provider";
import appConfig from "@/config/app.config";
import { ThemeProvider } from "@/context/ThemeProvider";
import ToasterContext from "@/context/ToasterProvider";
import ReactQueryProvider from "@/hooks/reactQuery";

export const dynamic = "force-dynamic";

const outfit = Outfit({
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: appConfig.title,
    description: appConfig.description,
    metadataBase: new URL(`https://${headers().get("host")}`),
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <html lang="en" className={outfit.className}>
        <body>
          <ThemeProvider>
            <ToasterContext />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryProvider>
  );
}
