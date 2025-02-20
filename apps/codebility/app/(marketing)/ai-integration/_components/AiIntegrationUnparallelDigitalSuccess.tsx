import { unparalleledDigitalSuccessData } from "../_lib/dummy-data";
import Section from "../../_components/MarketingSection";
import UnparallelCard from "./AiIntegrationUnparallelCard";

const UnparallelDigitalSuccess = () => {
  return (
    <Section className="relative z-10 mx-auto mt-16 flex max-w-7xl flex-col  gap-5 md:mt-20 md:gap-7 xl:mt-32 xl:px-14">
      <h2 className="text-2xl font-semibold md:mx-auto md:w-2/3 md:text-center  md:text-5xl lg:w-full lg:text-6xl xl:mx-0 xl:text-start ">
        Unparalleled Digital Success
      </h2>
      <p className="text-md md:mx-auto md:w-2/3 md:text-center lg:w-[785px] lg:text-xl xl:mx-0 xl:w-[850px] xl:text-start">
        We don’t just build websites; we create digital experiences that drive
        growth and success for your business. Here’s what we offer when you
        choose to partner with us:
      </p>

      <div className="mx-auto flex flex-col items-center justify-center gap-5 md:mt-5 md:flex-row md:flex-wrap md:gap-10 lg:mt-10 xl:flex-row">
        {unparalleledDigitalSuccessData.map((data) => (
          <UnparallelCard
            key={data.id}
            title={data.title}
            description={data.description}
            image={data.image}
          />
        ))}
      </div>

      <div
        className="absolute left-1/2 top-20 -z-10 h-[95%] w-[95%] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(106, 120, 242, 0.2) 41.75%, rgba(193, 8, 254, 0.2) 57.3%, rgba(29, 29, 30, 0.2) 73.99%)",
        }}
      ></div>
    </Section>
  );
};

export default UnparallelDigitalSuccess;
