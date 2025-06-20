import Image from "next/image";
import Link from "next/link";
import { Button } from "@/Components/ui/button";

import Container from "../MarketingContainer";
import Section from "../MarketingSection";

const WorkWithUs = () => {
  return (
    <Section
      id="workwithus"
      className="border-light-900/5 bg-light-900/5 relative w-full border-y-4"
    >
      <Container className="relative z-10 mx-auto max-w-[1100px] px-4 text-white">
        <div className="flex flex-col gap-6 md:gap-10">
          <h2 className="text-center text-xl md:text-3xl">Work With Us</h2>

          {/* Updated grid layout for 3 cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            
            {/* Card 1: Portfolio */}
            <div className="border-light-900/5 bg-light-700/10 flex h-full flex-col gap-4 rounded-lg border-2 p-4">
              <div className="aspect-[500/359] w-full overflow-hidden rounded-xl">
                <Image
                  src="https://codebility-cdn.pages.dev/assets/images/index/projects-large.jpg"
                  alt="portfolio projects"
                  width={500}
                  height={359}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="flex-1 text-sm leading-relaxed">
                Build your own website with us today and ensure a reliable,
                cutting-edge online presence.
              </p>
              <div className="flex md:justify-end">
                <div className="w-full md:w-auto">
                  <Link href="/portfolio">
                    <Button variant="purple" size="lg" rounded="full">
                      Our Portfolio
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Hire Developers */}
            <div className="border-light-900/5 bg-light-700/10 flex h-full flex-col gap-4 rounded-lg border-2 p-4">
              <div className="aspect-[500/359] w-full overflow-hidden rounded-xl">
                <Image
                  src="https://codebility-cdn.pages.dev/assets/images/index/codevs-large.jpg"
                  alt="professional developers"
                  width={500}
                  height={359}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="flex-1 text-sm leading-relaxed">
                Connect with the best developer to meet your needs through our
                top-rated professionals.
              </p>
              <div className="flex md:justify-end">
                <div className="w-full md:w-auto">
                  <Link href="/codevs">
                    <Button variant="purple" size="lg" rounded="full">
                      Hire a CoDev
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3: Developer Journey */}
            <div className="border-light-900/5 bg-light-700/10 flex h-full flex-col gap-4 rounded-lg border-2 p-4">
              <div className="aspect-[500/359] w-full overflow-hidden rounded-xl">
                <Image
                  src="/assets/images/index/image.png"
                  alt="developer learning journey phases"
                  width={500}
                  height={359}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="flex-1 text-sm leading-relaxed">
                Connect with our developer community and explore exciting career opportunities in tech.
              </p>
              <div className="flex md:justify-end">
                <div className="w-full md:w-auto">
                  <Link href="/auth/onboarding">
                    <Button variant="purple" size="lg" rounded="full">
                      Apply as Codev
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Container>

      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(22.1% 28.3%, 6% 40.5%, 0.8% 63.5%, 9.3% 84.8%, 23.6% 88.5%, 48.9% 88.8%, 77.2% 88.5%, 92.4% 71.5%, 93.9% 51.5%, 85.9% 36.8%, 70% 29.5%, 46.1% 29%)",
          }}
          className="relative aspect-[855/678] w-[40rem] bg-gradient-to-r from-[#00738B] via-[#0C3FDB] to-[#9707DD] opacity-20 sm:w-[72.1875rem]"
        />
      </div>
    </Section>
  );
};

export default WorkWithUs;