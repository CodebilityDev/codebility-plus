import "@/app/globals.css" 
import React from "react"
import { Metadata } from "next"
import { headers } from "next/headers"
import { Outfit } from "next/font/google"
import { ThemeProvider } from "@/context/ThemeProvider"
import { ModalProvider } from "@/Components/providers/modal-provider"

import ToasterContext from "@/context/ToasterProvider"
import ReactQueryProvider from "@/hooks/reactQuery"

export const dynamic = "force-dynamic"

const outfit = Outfit({
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Codebility",
    description:
      "Unlock the world of coding with Codebility - where passion meets innovation. Dive into immersive programs covering Web Development, Mobile Development, UI/UX Design, and Digital Marketing. Transform your skills with real-world standards. Join us in crafting a brighter future as tomorrow's digital architect.",
    metadataBase: new URL(`https://${headers().get("host")}`),
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
  )
}
