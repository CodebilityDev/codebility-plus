import Image from "next/image";
import Link from "next/link";
import { Button } from "@/Components/ui/button";

import { MarketingCardData } from "../../../../constants/landing_data";
import Container from "../MarketingContainer";
import SideNavMenu from "../MarketingSidenavMenu";
import HeroBackground from "./LandingHeroBg";
import HeroCard from "./LandingHeroCard";
import { ArrowRightIcon } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative">
      <HeroBackground />

      {/* Todo add white grid here in png */}

      <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-cover bg-no-repeat text-white">
        <SideNavMenu />
        <Container className="flex flex-col gap-10 lg:gap-20 mt-12">
          <div className="relative">
            <div className="relative z-10 flex flex-col gap-8 pt-20 text-center lg:pt-0">
              <div className="flex flex-col gap-4">
                <p className="text-lg font-normal uppercase md:text-2xl lg:font-semibold">
                  Codebility
                </p>
                <h1 className="flex flex-col gap-1 text-4xl font-semibold md:text-6xl">
                  <span>We Lead in Digital</span>
                  <span>Innovation & Design</span>
                </h1>
                <h2 className="text-2xl">Helping you achieve impactful results</h2>
              </div>
              <div className="md:mx-auto">
                <div className="flex w-full flex-col items-center gap-4 md:flex-row">
                  <Link href="/services">
                    <Button variant="outline" size="lg" rounded="full" className="">
                      Our Portfolio
                    </Button>
                  </Link>

                  <Link href="/bookacall">
                    <Button
                      variant="purple"
                      rounded="full"
                      size="lg"
                    >
                      Let&apos;s Connect
                    </Button>
                  </Link>

                  <Link href="#features">
                    <Button variant="outline" size="lg" rounded="full">
                      Learn more
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <Image
              src={`https://codebility-cdn.pages.dev/assets/images/index/hero-grid.png`}
              alt="Hero Grid Background"
              width={1300}
              height={340}
              className="absolute -top-[10%] left-1/2 -translate-x-1/2 transform"
              priority
            />
          </div>

          <div className="grid w-full grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5">
            {MarketingCardData.map((data, index) => (
              <HeroCard
                key={index}
                title={data.title}
                description={data.description}
                url={data.url}
              />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Hero;
