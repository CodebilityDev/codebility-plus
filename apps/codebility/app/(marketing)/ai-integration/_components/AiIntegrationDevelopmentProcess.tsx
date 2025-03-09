import { developmentProcessData } from "../_lib/dummy-data";
import Section from "../../_components/MarketingSection";
import ProcessCard from "./AiIntegrationProcessCard";

const DevelopmentProcess = () => {
  return (
    <Section className="flex flex-col gap-14 lg:hidden">
      <div className="flex flex-col gap-5">
        <h2 className="text-4xl font-semibold md:mx-auto md:w-2/3 md:text-center lg:w-full lg:text-start">
          Our Streamlined Development Process
        </h2>
        <p className="text-lg md:mx-auto md:w-2/3 md:text-center lg:w-full lg:text-start lg:text-xl">
          From Concept to Launch: Our Comprehensive Approach to Crafting
          Exceptional Websites{" "}
        </p>
      </div>
      <ol className="relative mx-auto w-72 border-s-2 border-dashed border-white">
        {developmentProcessData.map((developmentProcess) => (
          <li
            key={developmentProcess.id}
            className="mb-10 ms-14 flex flex-col gap-4"
          >
            <div className="absolute -start-1.5 h-3 w-3 rounded-full bg-white"></div>
            <ProcessCard
              id={developmentProcess.id}
              title={developmentProcess.title}
              process={developmentProcess.process}
            />
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default DevelopmentProcess;
