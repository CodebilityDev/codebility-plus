import React from "react";

import Container from "../_components/MarketingContainer";
import Footer from "../_components/MarketingFooter";
import Navigation from "../_components/MarketingNavigation";
import SideNavMenu from "../_components/MarketingSidenavMenu";
import BookACallCalendlyWidgetContainer from "./_components/BookACallCalendlyWidgetContainer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function BookCallPage() {
  return (
    <div
      className={`bg-black-400 relative flex min-h-screen w-full flex-col items-center overflow-x-hidden overflow-y-hidden`}
    >
      <Navigation />
      <SideNavMenu />

      <Container className=" relative z-10 flex w-full  max-w-screen-sm flex-col gap-6 pt-10 text-white lg:mx-60  lg:max-w-screen-lg lg:flex-row lg:justify-between lg:gap-10 lg:pt-32">
        <div className="flex w-full  flex-col gap-2 text-center lg:pt-64 lg:text-left">
          <h2 className="text-3xl font-bold uppercase md:text-5xl">
            Book a meeting!
          </h2>
          <p className="text-md lg:text-lg"></p> Schedule a meeting with our
          experts
          <p> to discuss your needs and find tailored solutions.</p>
        </div>

        <BookACallCalendlyWidgetContainer />
      </Container>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(0% 31.5%, 75.3% 19.5%, 100% 50%, 75.5% 80.5%, 0% 67.8%, 0% 50%)",
          }}
          className="relative aspect-[855/678] w-[40rem] bg-gradient-to-r from-customBlue-700 via-customBlue-800 to-customViolet-300 opacity-20 sm:w-[72.1875rem]"
        />
      </div>
      <Footer />
    </div>
  );
}
