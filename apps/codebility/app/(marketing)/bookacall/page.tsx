"use client"

import React from "react"
import Footer from "@/app/(marketing)/Footer"
import Container from "@/app/(marketing)/Container"
import { InlineWidget } from "react-calendly"
import Navigation from "@/app/(marketing)/Navigation"
import SideNavMenu from "@/app/(marketing)/index/components/SideNavMenu"

export default function Page() {
  return (
    <div
      className={`relative flex min-h-screen w-full flex-col items-center overflow-x-hidden overflow-y-hidden bg-black-400`}
    >
      <Navigation />
      <SideNavMenu />

      <Container className=" relative z-10 flex w-full  max-w-screen-sm flex-col gap-6 pt-10 text-white lg:mx-60  lg:max-w-screen-lg lg:flex-row lg:justify-between lg:gap-10 lg:pt-32">
        <div className="flex w-full  flex-col gap-2 text-center lg:pt-64 lg:text-left">
          <h2 className="text-3xl font-bold uppercase md:text-5xl">Book a meeting!</h2>
          <p className="text-md lg:text-lg"></p> Schedule a meeting with our experts
          <p> to discuss your needs and find tailored solutions.</p>
        </div>

        <div className="calendly-widget-container w-full justify-center">
          <InlineWidget url="https://calendly.com/codebility-dev/30min" />
        </div>
      </Container>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath: "polygon(0% 31.5%, 75.3% 19.5%, 100% 50%, 75.5% 80.5%, 0% 67.8%, 0% 50%)",
          }}
          className="relative aspect-[855/678] w-[40rem] bg-gradient-to-r from-[#00738B] via-[#0C3FDB] to-[#9707DD] opacity-20 sm:w-[72.1875rem]"
        />
      </div>
      <Footer />
    </div>
  )
}