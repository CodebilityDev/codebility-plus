import { Button } from "@/Components/ui/button"
import { ServicesCardData } from "@/app/(marketing)/index/components/data"
import FeaturesCard from "@/app/(marketing)/index/components/FeaturesCard"
import Container from "@/app/(marketing)/Container"
import Section from "@/app/(marketing)/Section"

const Features = () => {
  return (
    <Section id="features" className="relative">
      <Container className="flex flex-col gap-10 text-white">
        <div className="flex max-w-[650px] flex-col gap-3">
          <p className="text-left text-lg text-violet md:text-2xl">In the tech industry</p>
          <h2 className="text-left text-xl md:text-3xl">
            Codebility sparks for a passion for <strong>technology and innovation.</strong>
          </h2>
          <p className="text-gray">
            Our programs go beyond skill acquisition, because acquisition, because we believe in the trans-formative
            power of coding
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {ServicesCardData.map((data, index) => (
            <FeaturesCard
              key={index}
              imageAlt={data.imageAlt}
              imageName={data.imageUrl}
              description={data.description}
              title={data.title}
            />
          ))}
        </div>

        <div className="md:mx-auto">
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <a href="#book">
              <Button variant="purple" size="lg" rounded="full" className="h-14">
                Book a call
              </Button>
            </a>
          </div>
        </div>
      </Container>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
          className="relative aspect-[855/678] w-[40rem] bg-[#6A78F2] opacity-20 sm:w-[72.1875rem]"
        />
      </div>
    </Section>
  )
}

export default Features
