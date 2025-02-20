import { partnerData } from "../_lib/dummy-data";
import Section from "../../_components/MarketingSection";
import PartnerCard from "./AiIntegrationPartnerCard";

const Partner = () => {
  return (
    <Section className="flex flex-col items-center gap-10 lg:hidden">
      <h2 className="text-center text-4xl font-semibold">
        Why Partner with Codebility?
      </h2>
      <div className="grid w-[95%] grid-cols-1 gap-5 md:grid-cols-2">
        {partnerData.map((partner) => (
          <PartnerCard
            key={partner.id}
            title={partner.title}
            description={partner.description}
          />
        ))}
      </div>
    </Section>
  );
};

export default Partner;
