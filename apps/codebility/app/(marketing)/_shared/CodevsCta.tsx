import Image from "next/image";import Link from "next/link";
import { H2, Paragraph } from "@/components/shared/home";
import { Button } from "@/components/ui/button";
import pathsConfig from "@/types/zod/paths.config";

import MarketingProgressiveSection from "./MarketingProgressiveSection";
import ProgressiveMotion from "./ProgressiveMotion";
import Section from "./CodevsSection";

export default function CTA() {
  const skeleton = (
    <div className="mx-auto flex h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 px-5 text-center text-white">
      <Image
        src="/assets/images/CTA.png"
        alt="Codebility Devices"
        width={100}
        height={100}
        className="z-10 h-[200px] w-[200px] object-contain"
      />
      <H2 className="text-primaryColor capitalize">
        Become A <span className="text-customViolet-300">Codev!</span>
      </H2>
      <Paragraph className="lg:max-w-auto z-10 mx-auto max-w-[550px]">
        Unlock your potential and embark on a journey of innovation and mastery
        with Codebility.
      </Paragraph>
      <Link href={pathsConfig.auth.signIn}>
        <Button variant="purple" size="lg" rounded="full" className="md:w-40">
          Join Now
        </Button>
      </Link>
    </div>
  );

  return (
    <Section className="mx-0">
      <MarketingProgressiveSection skeleton={skeleton}>
        <ProgressiveMotion
          className="mx-auto flex h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 px-5 text-center text-white"
          y={30}
          duration={0.6}
          staggerChildren={0.12}
        >
          <div data-progressive-child>
            <Image
              src="/assets/images/CTA.png"
              alt="Codebility Devices"
              width={100}
              height={100}
              className="z-10 h-[200px] w-[200px] object-contain"
            />
          </div>
          <H2 data-progressive-child className="text-primaryColor capitalize">
            Become A <span className="text-customViolet-300">Codev!</span>
          </H2>
          <Paragraph
            data-progressive-child
            className="lg:max-w-auto z-10 mx-auto max-w-[550px]"
          >
            Unlock your potential and embark on a journey of innovation and
            mastery with Codebility.
          </Paragraph>
          <div data-progressive-child>
            <Link href={pathsConfig.auth.signIn}>
              <Button
                variant="purple"
                size="lg"
                rounded="full"
                className="md:w-40"
              >
                Join Now
              </Button>
            </Link>
          </div>
        </ProgressiveMotion>
      </MarketingProgressiveSection>
    </Section>
  );
}
