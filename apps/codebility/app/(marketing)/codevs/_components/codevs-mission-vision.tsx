import Image from "next/image"
import { SectionWrapper, H2, Paragraph } from "@/Components/shared/home"

const MissionVision = () => {
  return (
    <SectionWrapper className="relative">
      <div className="z-10 flex flex-col gap-12 lg:flex-row lg:gap-6">
        <div className="my-auto flex basis-[50%] flex-col gap-4 text-center lg:basis-[25%] lg:text-end">
          <H2 className="text-primaryColor">Mission</H2>
          <Paragraph className="lg:max-w-auto z-10 mx-auto max-w-[400px]">
            At Codebility, we ignite a passion for technology, offering immersive programs in Web Development, Mobile
            Development, UI/UX Design, and Digital Marketing.
          </Paragraph>
          <Paragraph className="lg:max-w-auto z-10 mx-auto max-w-[400px]">
            Beyond imparting skills, we believe in the transformative power of coding as a tool for a brighter future.
            Join us in sculpting your path as tomorrow{`'`}s digital architect.
          </Paragraph>
        </div>
        <div className="hidden items-center justify-center lg:flex lg:basis-[50%]">
          <Image
            src="/assets/images/mission-vision-image.png"
            alt="Codebility Devices"
            width={600}
            height={399}
            className="z-10 h-[399px] w-[600px] object-contain"
          />
        </div>
        <div className="my-auto flex basis-[50%] flex-col gap-4 text-center lg:basis-[25%] lg:text-start">
          <H2 className="text-primaryColor">Vision</H2>
          <Paragraph className="lg:max-w-auto z-10 mx-auto max-w-[400px] lg:text-start">
            Codebility envisions a world where coding unleashes innovation. We aspire to be a global hub, nurturing a
            community proficient in Web, Mobile, UI/UX, and Digital Marketing.
          </Paragraph>
          <Paragraph className="lg:max-w-auto z-10 mx-auto max-w-[400px] lg:text-start">
            Our goal is to empower learners, shaping them into accomplished digital architects who drive the future of
            the tech industry.
          </Paragraph>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[30%] transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(40%-10rem)] aspect-[855/678] w-[36.125rem] -translate-x-1/2 rotate-[60deg] bg-gradient-to-tr from-teal to-violet opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </SectionWrapper>
  )
}

export default MissionVision
