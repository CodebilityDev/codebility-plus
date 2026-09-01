"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Quote } from "lucide-react";

import MarketingProgressiveSection from "../../_shared/MarketingProgressiveSection";
import ProgressiveMotion from "../../_shared/ProgressiveMotion";
import BlueBg from "../landing/LandingBlueBg";
import type { ClientTestimonyType } from "./Testimonials";

export default function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: ClientTestimonyType[];
}) {
  const skeleton = (
    <div className="relative z-10 mx-auto">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          What Our Partners Say
        </h2>
      </div>
      <div className="container">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => (
            <TestimonialCard key={testimonial.id} client={testimonial} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative px-4 py-16">
      <BlueBg className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform" />
      <MarketingProgressiveSection skeleton={skeleton}>
        <div className="relative z-10 mx-auto">
          <ProgressiveMotion
            className="mb-12 text-center"
            y={28}
            duration={0.55}
          >
            <h2
              data-progressive-child
              className="mb-4 text-3xl font-bold text-white md:text-4xl"
            >
              What Our Partners Say
            </h2>
          </ProgressiveMotion>

          <ProgressiveMotion className="container" y={28} duration={0.55}>
            <div data-progressive-child>
              <Carousel
                plugins={[
                  Autoplay({
                    delay: 4000,
                  }),
                ]}
                opts={{
                  loop: true,
                  slidesToScroll: 1,
                }}
                className="py-0 xl:px-20"
              >
                <CarouselContent className="md:px-2 xl:px-5">
                  {testimonials.map((testimonial) => (
                    <CarouselItem
                      key={testimonial.id}
                      className="ml-5 basis-full md:basis-1/2 lg:basis-1/3"
                    >
                      <TestimonialCard client={testimonial} />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {testimonials.length >= 3 && (
                  <>
                    <CarouselPrevious className="hidden h-full min-h-full xl:flex" />
                    <CarouselNext className="hidden h-full min-h-full xl:flex" />
                  </>
                )}
              </Carousel>
            </div>
          </ProgressiveMotion>
        </div>
      </MarketingProgressiveSection>
    </section>
  );
}

function TestimonialCard({ client }: { client: ClientTestimonyType }) {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-customBlue-300">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <Quote className="h-10 w-10 text-purple-400 opacity-90" />
          </div>

          <blockquote className="leading-relaxed text-gray-100">
            {client.testimony}
          </blockquote>

          <div className="mt-auto flex items-center gap-4 border-t border-gray-700/50 pt-4">
            <div className="relative h-12 w-24 flex-shrink-0">
              <Image
                src={client.company_logo}
                alt={`${client.name} logo`}
                className="object-contain brightness-110"
                fill
                sizes="96px"
              />
            </div>
            <div className="hidden min-w-0 flex-1 sm:flex">
              <p className="truncate font-semibold text-white">{client.name}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
