import Link from "next/link"
import Image from "next/image"

import HeroCard from "@/app/(home)/index/components/HeroCard"
import Container from "@/app/(home)/Container"

import { MarketingCardData } from "@/app/(home)/index/components/data"
import HeroBackground from "@/app/(home)/index/components/HeroBackground"
import { Button } from "@/Components/ui/button"
import SideNavMenu from "@/app/(home)/index/components/SideNavMenu"

const Hero = () => {
  return (
    <div className="relative">
      <HeroBackground />

      {/* Todo add white grid here in png */}

      <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-cover bg-no-repeat text-white">
        <SideNavMenu />
        <Container className="flex flex-col gap-10 lg:gap-20">
          <div className="relative">
            <div className="relative z-10 flex flex-col gap-8 pt-20 text-center lg:pt-0">
              <div className="flex flex-col gap-4">
                <p className="text-lg font-normal uppercase md:text-2xl lg:font-semibold">Codebility</p>
                <h1 className="flex flex-col gap-1 text-4xl font-semibold md:text-6xl">
                  <span>We lead in digital</span>
                  <span>innovation & design</span>
                </h1>
                <h2 className="text-2xl">Helping you achieve impact results</h2>
              </div>
              <div className="md:mx-auto">
                <div className="flex w-full flex-col gap-4 md:flex-row">
                  <Link href="#workwithus">
                    <Button variant="purple" size="lg" rounded="full">
                      Our Portfolio
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outlined" size="lg" rounded="full">
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
              className="absolute -top-[10%] left-1/2 h-[340px] w-[1300px] -translate-x-1/2 transform"
            />
          </div>

          <div className="grid w-full grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-5">
            {MarketingCardData.map((data, index) => (
              <HeroCard key={index} title={data.title} description={data.description} url={data.url} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}

export default Hero
