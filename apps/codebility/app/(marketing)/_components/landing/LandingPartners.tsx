"use client";

import LandingImage from "./LandingImage";

import Section from "../MarketingSection";
import ProgressiveMotion from "./ProgressiveMotion";
import { LandingPartnersSkeleton } from "./LandingSectionSkeletons";

const partners = [
  {
    name: "Genius Web Services",
    logo: "/assets/images/partners/genius-web-services.png",
  },
  { name: "Travel Tribe", logo: "/assets/images/partners/travel-tribe.png" },
  { name: "Netmedia", logo: "/assets/images/partners/netmedia.png" },
  { name: "Zwift Tech", logo: "/assets/images/partners/zwift-tech.png" },
  { name: "Bradwell", logo: "/assets/images/partners/bradwell.png" },
  { name: "Ai", logo: "/assets/images/partners/ai.png" },
  { name: "Averps", logo: "/assets/images/partners/averps.png" },
  { name: "Tolle Design", logo: "/assets/images/partners/tolle-design.png" },
  { name: "Infraspan", logo: "/assets/images/partners/infraspan.png" },
  {
    name: "Federal PLANS",
    logo: "/assets/images/partners/federal-plans.png",
  },
  { name: "Web Divine", logo: "/assets/images/partners/web-divine.png" },
  { name: "FixFlow.ai", logo: "/assets/images/partners/fixflow-ai.png" },
];

export default function Partners() {
  return (
    <Section id="partners" className="relative w-full pt-10 text-white">
      <div data-landing-section>
        <div data-landing-skeleton>
          <LandingPartnersSkeleton />
        </div>
        <div data-landing-content>
          <div className="mx-auto w-full max-w-screen-lg px-8 py-8 text-white">
            <ProgressiveMotion
              className="mb-12 text-center"
              y={24}
              duration={0.5}
              staggerChildren={0.06}
            >
              <h2
                data-progressive-child
                className="mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-center text-4xl font-extrabold text-transparent sm:text-5xl"
              >
                Our Partners
              </h2>
              <p
                data-progressive-child
                className="text-center text-lg text-gray-300 sm:text-xl"
              >
                Meet Our Trusted Partners
              </p>
            </ProgressiveMotion>

            <ProgressiveMotion
              className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4"
              y={24}
              duration={0.5}
              staggerChildren={0.06}
            >
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  data-progressive-child
                  className="group relative flex h-32 w-full min-w-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300"
                >
                  <div className="relative z-10 h-full w-full min-w-0">
                    <LandingImage
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      fill
                      className="object-contain filter transition-all duration-300 group-hover:brightness-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                </div>
              ))}
            </ProgressiveMotion>
          </div>
        </div>
      </div>
    </Section>
  );
}
