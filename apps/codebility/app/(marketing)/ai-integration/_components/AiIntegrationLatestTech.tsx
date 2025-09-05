import Container from "../../_components/MarketingContainer";
import Section from "../../_components/MarketingSection";

const LatestTech = () => {
  return (
    <Section className="bg-latest-tech mt-5 flex h-96 w-full max-w-screen-2xl items-center justify-center bg-cover bg-center bg-no-repeat md:mt-10 lg:mt-20 lg:h-[450px]">
      <Container className="text-white">
        <h2 className="mx-auto w-80 text-center text-4xl font-light md:w-full md:leading-relaxed xl:leading-loose">
          We use the latest tech for a <br className="hidden md:block" />{" "}
          <span className="text-customTeal font-medium xl:text-5xl">fast</span>,{" "}
          <span className="font-medium text-customViolet-200 xl:text-5xl">
            secure
          </span>
          , <span className="font-medium xl:text-5xl">&</span>{" "}
          <span className="font-medium text-customBlue-100 xl:text-5xl">
            future-proof
          </span>
          <br className="hidden md:block" /> websites.
        </h2>
      </Container>
    </Section>
  );
};

export default LatestTech;
