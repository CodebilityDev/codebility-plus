import Image from "next/image";

import Container from "../MarketingContainer";
import Section from "../MarketingSection";

const WhyChooseUs = () => {
  return (
    <Section id="whychooseus" className="relative w-full pt-10 text-white">
      <Container className="text-white">
        <div className="flex flex-col gap-6 md:gap-10">
          <h2 className="text-center text-xl md:text-3xl lg:text-left">
            Why Choose Codebility?
          </h2>
          <div className="flex grid-cols-1 grid-rows-4 flex-col gap-3 md:grid md:grid-cols-4 lg:gap-4">
            <div className="border-dark-100 bg-black-600 col-start-1 col-end-1 row-start-1 row-end-1 rounded-lg border-2 p-4 md:col-end-3 md:row-end-3 md:p-6">
              <div className="flex h-full flex-col place-items-center justify-around gap-3 text-center">
                <Image
                  src="https://codebility-cdn.pages.dev/assets/images/index/choose-approach.png"
                  alt="innovative approach"
                  width={300}
                  height={300}
                  className="h-[150px] w-[150px] object-contain lg:h-[300px] lg:w-[300px]"
                  
                />
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium md:text-2xl lg:text-3xl">
                    Innovative Approach
                  </h3>
                  <p className="text-gray">
                    Embrace innovation with Codebility. Crafting revolutionary
                    digital solutions that create new posibilites
                  </p>
                </div>
              </div>
            </div>

            <div className="border-dark-100 bg-black-600 col-start-1 col-end-1 row-start-2 row-end-2 rounded-lg border-2 p-4 md:col-start-3 md:col-end-5 md:row-start-1 md:row-end-4 md:p-6">
              <div className="flex h-full flex-col place-items-center justify-around gap-3">
                <Image
                  src="https://codebility-cdn.pages.dev/assets/images/index/choose-shield.png"
                  alt="shield"
                  width={400}
                  height={400}
                  className="h-[150px] w-[150px] object-contain lg:h-[400px] lg:w-[400px]"
                  
                />
                <div className="flex flex-col gap-2 text-center">
                  <h3 className="text-lg font-medium md:text-2xl lg:text-3xl">
                    Reliable and Trusted
                  </h3>
                  <p className="text-gray">
                    Codebility has a proven track record across diverse
                    industries, trusted for our reliability, consistency, and
                    on-time delivery—your dependable digital partner.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-start-1 col-end-2 row-start-3 row-end-5 hidden overflow-hidden rounded-xl bg-blue-100 lg:block">
              <Image
                src="https://codebility-cdn.pages.dev/assets/images/index/choose-hands.jpg"
                alt="codevs"
                width={300}
                height={450}
                className="h-full w-full object-cover"
                
              />
            </div>
            <div className="border-dark-100 bg-black-600 col-start-1 col-end-1 row-start-3 row-end-3 rounded-lg border-2 p-4 md:col-end-3 md:row-end-5 md:p-6 lg:col-start-2">
              <div className="flex h-full flex-col place-items-center justify-around gap-3">
                <Image
                  src="https://codebility-cdn.pages.dev/assets/images/index/choose-heart.png"
                  alt="tailored"
                  width={200}
                  height={200}
                  className="h-[150px] w-[150px] object-contain lg:h-[200px] lg:w-[200px]"
                  
                />
                <div className="flex flex-col gap-2 text-center">
                  <h3 className="font-medium md:text-2xl">
                    Customer - Centric Solution
                  </h3>
                  <p className="text-gray">
                    Understanding your vision and helping you bring your online
                    vision to life.{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-start-1 col-end-1 row-start-4 row-end-4 grid place-items-center rounded-xl bg-gradient-to-r from-[#00738B] via-[#0C3FDB] to-[#9707DD] md:col-start-3 md:col-end-5 md:row-end-5">
              <p className="py-10 text-lg font-medium md:text-2xl lg:text-3xl">
                Your Uniqueness is our focus
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default WhyChooseUs;
