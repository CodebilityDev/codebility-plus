import Image from "next/image";
import Link from "next/link";
import { abstractCircle } from "@/public/assets/images/ai-integration";

import Section from "../../_components/MarketingSection";

const NextStep = () => {
  return (
    <Section className="mb-10 flex flex-col gap-14 lg:flex-row lg:justify-between xl:gap-60">
      <div className="mx-auto h-[397px] w-[91%] bg-white/5 md:w-96">
        <Image
          src={abstractCircle}
          alt="Abstract Circle"
          width={0}
          height={0}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mx-auto flex w-[91%] flex-col justify-center gap-5 md:w-auto lg:w-[497px] lg:gap-7">
        <h2 className="text-4xl font-semibold md:mx-auto md:w-2/3 md:text-center lg:w-full lg:text-start">
          Take the Next Step
        </h2>
        <p className="text-lg md:mx-auto md:w-2/3 md:text-center lg:w-full lg:text-start lg:text-xl">
          Transform your business website with the power of AI.
          <span className="font-semibold">
            {" "}
            Partner with Codebility to create a dynamic, efficient, and
            personalized online presence
          </span>{" "}
          that drives engagement, boosts sales, and sets you apart from the
          competition.
        </p>
        <p className="text-lg md:mx-auto md:w-2/3 md:text-center lg:w-full lg:text-start lg:text-xl">
          Inquire to us today to learn more about how our AI solutions can
          benefit your business.
        </p>
        <Link
          href="/bookacall"
          className="w-max rounded-full bg-customViolet-100 px-6 py-2 text-base font-semibold text-white md:mx-auto lg:mx-0 lg:text-lg "
        >
          Let{`'`}s Connect
        </Link>
      </div>
    </Section>
  );
};

export default NextStep;
