import "server-only"
import LeftSidebar from "@/Components/shared/dashboard/LeftSidebar"
import Navbar from "@/Components/shared/dashboard/Navbar"
import React from "react"
import ReactQueryProvider from "@/hooks/reactQuery"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <main className="background-light850_dark100 relative">
        <Navbar />
        <div className="flex">
          <LeftSidebar />
          <section className="background-lightsection_darksection flex min-h-screen flex-1 flex-col px-4 pb-6 pt-36 max-md:pb-14 md:px-8 lg:px-12">
            <div className="max-w-8xl mx-auto h-full w-full">{children}</div>
          </section>
        </div>
      </main>
    </ReactQueryProvider>
  )
}
