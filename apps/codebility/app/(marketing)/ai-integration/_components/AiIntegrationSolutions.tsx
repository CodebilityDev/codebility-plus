import Image from "next/image";

import Container from "../../_components/MarketingContainer";
import Section from "../../_components/MarketingSection";
import GradientBackgroundWhite from "./AiIntegrationGradientBgWhite";

const AISolutions = () => {
  return (
    <Section className="z-20 mt-10 md:mt-20 lg:mt-48 xl:mt-56">
      <Container className="text-white">
        <div className="flex flex-col gap-6 md:gap-10">
          <h2 className="text-4xl font-semibold md:mx-auto md:w-2/3 md:text-center md:text-5xl lg:w-[809px] lg:text-6xl">
            The Power of Your Website with Our{" "}
            <span className="text-teal">AI Solutions</span>
          </h2>
          <p className="text-lg md:mx-auto md:w-2/3 md:text-center lg:w-[785px] lg:text-xl xl:w-[900px]">
            At Codebility, we specialize in integrating innovative Artificial
            Intelligence (AI) into websites, transforming them into dynamic,
            efficient, and highly personalized platforms.
          </p>
          <div className="relative flex grid-cols-1 grid-rows-4 flex-col gap-3 md:grid md:grid-cols-4 lg:gap-4">
            <div className="border-dark-100 bg-black-600 col-start-1 col-end-1 row-start-1 row-end-1 rounded-lg border-2 p-4 md:col-end-3 md:row-end-3 md:p-6">
              <div className="flex h-full flex-col place-items-center justify-around gap-3 text-center xl:px-10">
                <Image
                  src="/assets/images/ai-integration/competitive.png"
                  alt="competitive edge"
                  width={300}
                  height={300}
                  className="h-[150px] w-[150px] object-contain lg:h-[300px] lg:w-[300px]"
                />
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium md:text-2xl">
                    Competitive Edge
                  </h3>
                  <p className="text-gray">
                    By integrating AI into your website, you gain a significant
                    competitive advantage. Stand out in your industry with
                    advanced technology that meets modern consumer expectations.
                  </p>
                </div>
              </div>
            </div>
            <div className="border-dark-100 bg-black-600 col-start-1 col-end-1 row-start-2 row-end-2 rounded-lg border-2 p-4 md:col-start-3 md:col-end-5 md:row-start-1 md:row-end-4 md:p-6">
              <div className="flex h-full flex-col place-items-center justify-around gap-3 xl:px-16">
                <Image
                  src="/assets/images/ai-integration/customize.png"
                  alt="personalized user experience"
                  width={400}
                  height={400}
                  className="h-[150px] w-[150px] object-contain lg:h-[400px] lg:w-[400px]"
                />
                <div className="flex flex-col gap-2 text-center">
                  <h3 className="text-lg font-medium md:text-2xl">
                    Personalized User Experience
                  </h3>
                  <p className="text-gray">
                    AI tailors your website to each visitor’s preferences,
                    providing personalized content, product recommendations, and
                    user journeys.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-start-1 col-end-2 row-start-3 row-end-5 hidden overflow-hidden rounded-xl bg-customBlue-100 lg:block">
              <Image
                src="/assets/images/ai-integration/woman.jpg"
                alt="woman"
                width={300}
                height={450}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="border-dark-100 bg-black-600 col-start-1 col-end-1 row-start-3 row-end-3 rounded-lg border-2 p-4 md:col-end-3 md:row-end-5 md:p-6 lg:col-start-2">
              <div className="flex h-full flex-col place-items-center justify-around gap-3">
                <Image
                  src="/assets/images/ai-integration/scalable.png"
                  alt="tailored"
                  width={200}
                  height={200}
                  className="h-[150px] w-[150px] object-contain lg:h-[200px] lg:w-[200px]"
                />
                <div className="flex flex-col gap-2 text-center">
                  <h3 className="font-medium md:text-2xl">
                    Seamless Scalability
                  </h3>
                  <p className="text-gray">
                    Our AI solutions scale effortlessly with your business,
                    managing increased traffic and data without compromising
                    performance.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-start-1 col-end-1 row-start-4 row-end-4 grid place-items-center overflow-hidden rounded-lg md:col-start-3 md:col-end-5 md:row-end-5">
              <Image
                src="/assets/images/ai-integration/blue-wave.jpg"
                alt="blue wave"
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="border-dark-100 bg-black-600 col-start-1 col-end-1 row-start-5 row-end-5 rounded-lg border-2 p-4 md:col-start-1 md:col-end-3 md:row-end-5 md:p-6 lg:col-start-1">
              <div className="flex h-full flex-col place-items-center justify-around gap-3  xl:px-10 xl:py-5">
                <Image
                  src="/assets/images/index/choose-heart.png"
                  alt="tailored"
                  width={200}
                  height={200}
                  className="h-[150px] w-[150px] object-contain lg:h-[200px] lg:w-[200px]"
                />
                <div className="flex flex-col gap-2 text-center">
                  <h3 className="font-medium md:text-2xl">
                    24/7 Intelligent Customer Support
                  </h3>
                  <p className="text-gray">
                    AI-powered systems handle inquiries, guide users, and
                    troubleshoot issues, enhancing customer satisfaction and
                    freeing your team for complex tasks.
                  </p>
                </div>
              </div>
            </div>
            <div className="border-dark-100 bg-black-600 col-start-1 col-end-1 row-start-6 row-end-6 rounded-lg border-2 p-4 md:col-start-3 md:col-end-5 md:row-end-5 md:p-6 lg:col-start-3">
              <div className="flex h-full flex-col place-items-center justify-around gap-3 xl:px-12 xl:py-5">
                <Image
                  src="/assets/images/ai-integration/robot.png"
                  alt="tailored"
                  width={200}
                  height={200}
                  className="h-[150px] w-[150px] object-contain lg:h-[200px] lg:w-[200px]"
                />
                <div className="flex flex-col gap-2 text-center">
                  <h3 className="font-medium md:text-2xl">
                    Automated Content Management
                  </h3>
                  <p className="text-gray">
                    AI-driven tools keep your website engaging with high-quality
                    articles, product descriptions, and social media posts,
                    recommending relevant content to visitors.
                  </p>
                </div>
              </div>
            </div>
            <GradientBackgroundWhite className="left-1/2 top-1/2 -z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block lg:h-[900px] lg:w-[1000px] xl:h-[1165px] xl:w-[1302px]" />
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default AISolutions;
