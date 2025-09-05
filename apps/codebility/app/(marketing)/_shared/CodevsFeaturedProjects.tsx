import { fadeInOutDownToUp } from "@/components/FramerAnimation/Framer";
import { H2, SectionWrapper } from "@/components/shared/home";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel/carousel";
import { projects } from "@/constants";
import { motion } from "framer-motion";

import FeaturedProjectCard from "./CodevsFeaturedProjectCard";

const FeaturedProjects = () => {
  return (
    <SectionWrapper className="relative" id="projects">
      <motion.div
        variants={fadeInOutDownToUp}
        initial="hidden"
        whileInView="visible"
        className="mx-auto"
      >
        <H2 className="pb-4 text-center text-white lg:pb-20">Our Projects</H2>
      </motion.div>
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
    </SectionWrapper>
  );
};

export default FeaturedProjects;
