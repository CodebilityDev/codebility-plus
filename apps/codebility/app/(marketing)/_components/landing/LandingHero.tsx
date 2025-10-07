import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { MarketingCardData } from "@/constants/landing_data";
import Container from "../MarketingContainer";
import SideNavMenu from "../MarketingSidenavMenu";
import HeroBackground from "./LandingHeroBg";
import HeroCard from "./LandingHeroCard";

const HIGHLIGHT_METRICS = [
  { label: "Projects shipped", value: "120+" },
  { label: "Avg. client satisfaction", value: "4.9/5" },
  { label: "Specialists on demand", value: "80+" },
];

const Hero = () => {
  return (
    <div className="relative">
      <HeroBackground />

      <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden text-white">
        <SideNavMenu />

        <Container className="relative z-10 flex w-full max-w-[1400px] flex-col gap-20 px-8 py-20 md:px-12 md:py-24 lg:flex-row lg:items-center lg:gap-20 lg:px-16">
          <div className="flex w-full flex-col items-center gap-12 text-center lg:w-[58%] lg:items-start lg:text-left">
            <div className="flex flex-col gap-6">
              <span className="inline-flex items-center gap-2 self-center rounded-full border border-purple-300/30 bg-purple-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-purple-100 md:self-start">
                Strategic Digital Partner
              </span>
              <h1 className="flex flex-col gap-2 text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
                <span>Turn your ideas into</span>
                <span className="bg-gradient-to-r from-purple-200 via-white to-purple-300 bg-clip-text text-transparent">
                  profitable digital products
                </span>
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
                We combine strategy, creative marketing, and engineering to launch experiences your audience remembers. From
                high-converting landing pages to full digital ecosystems, Codebility moves modern brands forward.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 md:flex-row lg:items-center">
              <Link href="/bookacall" className="w-full md:w-auto">
                <Button variant="purple" size="lg" rounded="full" className="w-full md:w-auto">
                  Book a Strategy Call
                </Button>
              </Link>
              <Link href="/services" className="w-full md:w-auto">
                <Button variant="outline" rounded="full" size="lg" className="w-full border-white/40 text-white md:w-auto">
                  View Our Built Apps
                </Button>
              </Link>
            </div>

            <div className="grid w-full grid-cols-1 items-stretch gap-6 sm:grid-cols-3">
              {HIGHLIGHT_METRICS.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 text-center shadow-lg shadow-purple-500/10 backdrop-blur"
                >
                  <p className="text-2xl font-semibold text-white md:text-3xl">{metric.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-white/60 md:text-sm">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex w-full max-w-[520px] flex-col gap-8 self-center lg:w-[45%] lg:self-start">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10">
              {MarketingCardData.slice(0, 4).map((data, index) => (
                <HeroCard
                  key={index}
                  title={data.title}
                  description={data.description}
                  url={data.url}
                  category={data.category}
                />
              ))}
            </div>
          </div>
        </Container>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black via-black/40 to-transparent" aria-hidden="true" />
      </section>
    </div>
  );
};

export default Hero;
