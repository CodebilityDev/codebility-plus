"use client";

import { H2, SectionWrapper } from "@/components/shared/home";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel/carousel";
import { projects } from "@/constants";

import FeaturedProjectCard from "./CodevsFeaturedProjectCard";
import MarketingProgressiveSection from "./MarketingProgressiveSection";
import ProgressiveMotion from "./ProgressiveMotion";

const FeaturedProjects = () => {
  const skeleton = (
    <>
      <div className="mx-auto">
        <H2 className="pb-4 text-center text-white lg:pb-20">Our Projects</H2>
      </div>
      <Carousel className="lg:px-20">
        <CarouselContent>
          {projects.map((project) => (
            <CarouselItem key={project.id}>
              <FeaturedProjectCard
                name={project.name}
                image={project.image}
                logo={project.logo}
                desc={project.desc}
                link={project.link}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {projects.length > 1 && (
          <div>
            <CarouselPrevious />
            <CarouselNext />
          </div>
        )}
      </Carousel>
    </>
  );

  return (
    <SectionWrapper className="relative" id="projects">
      <MarketingProgressiveSection skeleton={skeleton}>
        <ProgressiveMotion className="mx-auto" y={30} duration={0.55}>
          <H2
            data-progressive-child
            className="pb-4 text-center text-white lg:pb-20"
          >
            Our Projects
          </H2>
        </ProgressiveMotion>
        <ProgressiveMotion y={24} duration={0.55}>
          <div data-progressive-child>
            <Carousel className="lg:px-20">
              <CarouselContent>
                {projects.map((project) => (
                  <CarouselItem key={project.id}>
                    <FeaturedProjectCard
                      name={project.name}
                      image={project.image}
                      logo={project.logo}
                      desc={project.desc}
                      link={project.link}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {projects.length > 1 && (
                <div>
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              )}
            </Carousel>
          </div>
        </ProgressiveMotion>
      </MarketingProgressiveSection>
    </SectionWrapper>
  );
};

export default FeaturedProjects;
