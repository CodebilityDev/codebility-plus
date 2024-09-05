import { motion } from "framer-motion"

import { projects } from "@/constants"
import { H2, SectionWrapper } from "@/Components/shared/home"
import { fadeInOutDownToUp } from "@/Components/FramerAnimation/Framer"
import { Carousel, CarouselPrevious } from "@/Components/ui/carousel/carousel"
import FeaturedProjectCard from "./codevs-featured-project-card"
import { CarouselContent, CarouselItem, CarouselNext } from "@/Components/ui/carousel/carousel"

const FeaturedProjects = () => {
  return (
    <SectionWrapper className="relative" id="projects">
      <motion.div variants={fadeInOutDownToUp} initial="hidden" whileInView="visible" className="mx-auto">
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
  )
}

export default FeaturedProjects
