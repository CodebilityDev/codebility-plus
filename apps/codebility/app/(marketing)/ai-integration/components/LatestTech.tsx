import Container from "../../_components/marketing-container"
import Section from "../../_components/marketing-section"

const LatestTech = () => {
  return (
    <Section className="mt-5 md:mt-10 lg:mt-20 flex h-96 w-full max-w-screen-2xl items-center justify-center bg-latest-tech bg-cover bg-center bg-no-repeat lg:h-[450px]">
      <Container className="text-white">
        <h2 className="mx-auto w-80 text-center text-4xl font-light md:w-full md:leading-relaxed xl:leading-loose">
          We use the latest tech for a <br className="hidden md:block" />{" "}
          <span className="font-medium text-[#02FFE2] xl:text-5xl">fast</span>,{" "}
          <span className="font-medium text-[#C108FE] xl:text-5xl">secure</span>,{" "}
          <span className="font-medium xl:text-5xl">&</span>{" "}
          <span className="font-medium text-[#6A78F2] xl:text-5xl">future-proof</span>
          <br className="hidden md:block" /> websites.
        </h2>
      </Container>
    </Section>
  )
}

export default LatestTech
