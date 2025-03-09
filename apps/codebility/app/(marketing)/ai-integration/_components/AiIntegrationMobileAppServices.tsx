import Image from "next/image";

import { mobileAppServicesData } from "../_lib/dummy-data";

const MobileAppServices = () => {
  return (
    <div className="mx-auto mt-16 flex max-w-screen-2xl flex-col gap-5 md:mt-20 md:gap-7 xl:mt-32">
      <h2 className="text-4xl font-semibold md:mx-auto md:w-full md:text-center md:text-5xl lg:w-[850px] lg:text-6xl xl:w-2/3">
        Comprehensive Mobile App Development Services
      </h2>
      <p className="text-lg md:mx-auto md:w-3/4 md:text-center lg:w-full lg:text-xl">
        Dynamic Mobile App Development Solutions: Elevate Your Business,
        Captivate Your Audience
      </p>

      <div className="flex flex-col items-center justify-center lg:flex-row">
        {mobileAppServicesData.map((service) => (
          <div key={service.id} className="relative">
            <Image
              src={
                service.image ||
                "https://codebility-cdn.pages.dev/assets/images/dafault-avatar-1248x845.jpg"
              }
              width={0}
              height={0}
              alt={service.title}
              className="h-[380px] w-[330px] border-4 border-[#1D1D1E] object-cover md:w-[380px] lg:w-[330px] xl:w-[380px]"
            />
            <div
              className="absolute left-1/2 top-0 h-[380px] w-[330px] -translate-x-1/2 md:w-[380px] lg:w-[330px] xl:w-[380px] "
              style={{
                background:
                  "linear-gradient(180deg, rgba(6, 6, 6, 0) 0%, #000000 100%)",
                border: "3px solid var(--Border, #1D1D1E)",
              }}
            ></div>
            <div className="absolute left-1/2 top-56 flex w-[280px] -translate-x-1/2 transform flex-col gap-2  text-center">
              <h3 className="text-xl font-semibold capitalize">
                {service.title}
              </h3>
              <p className="text-base">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileAppServices;
