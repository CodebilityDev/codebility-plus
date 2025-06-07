"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/Components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/Components/ui/carousel/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Quote } from "lucide-react";

import BlueBg from "../landing/LandingBlueBg";

const testimonials = [
  {
    quote:
      "Codebility transformed our business with their exceptional AI development. Their team delivered a solution that exceeded our expectations and significantly improved our operational efficiency.",
    partner: {
      name: "Genius Web Services",
      logo: "/assets/images/partners/genius-web-services.png",
    },
  },
  {
    quote:
      "Working with Codebility on our web application was a game-changer. Their expertise in digital innovation helped us create a platform that our users love. Highly recommended!",
    partner: {
      name: "Travel Tribe",
      logo: "/assets/images/partners/travel-tribe.png",
    },
  },
  {
    quote:
      "The mobile app developed by Codebility has received outstanding feedback from our customers. Their attention to detail and commitment to quality is unmatched in the industry.",
    partner: {
      name: "Netmedia",
      logo: "/assets/images/partners/netmedia.png",
    },
  },
  {
    quote:
      "Codebility's innovative solutions helped us streamline our operations and achieve remarkable growth. Their technical expertise and professional approach exceeded our expectations.",
    partner: {
      name: "Zwift Tech",
      logo: "/assets/images/partners/zwift-tech.png",
    },
  },
  {
    quote:
      "The custom software solution developed by Codebility perfectly matched our business requirements. Their team's dedication and technical skills are truly impressive.",
    partner: {
      name: "Bradwell",
      logo: "/assets/images/partners/bradwell.png",
    },
  },
  {
    quote:
      "Codebility's AI implementation revolutionized our processes. Their cutting-edge technology and seamless integration delivered results beyond our expectations.",
    partner: {
      name: "Ai",
      logo: "/assets/images/partners/ai.png",
    },
  },
  {
    quote:
      "Working with Codebility on our digital transformation was exceptional. Their comprehensive approach and technical excellence helped us achieve our goals efficiently.",
    partner: {
      name: "Averps",
      logo: "/assets/images/partners/averps.png",
    },
  },
  {
    quote:
      "The design and development services provided by Codebility elevated our brand presence. Their creative solutions and technical implementation were outstanding.",
    partner: {
      name: "Tolle Design",
      logo: "/assets/images/partners/tolle-design.png",
    },
  },
  {
    quote:
      "Codebility's infrastructure solutions transformed our operational capabilities. Their scalable architecture and reliable deployment process exceeded industry standards.",
    partner: {
      name: "Infraspan",
      logo: "/assets/images/partners/infraspan.png",
    },
  },
  {
    quote:
      "The comprehensive digital solution delivered by Codebility streamlined our planning processes. Their expertise in government sector requirements was invaluable.",
    partner: {
      name: "Federal PLANS",
      logo: "/assets/images/partners/federal-plans.png",
    },
  },
  {
    quote:
      "Codebility's web development expertise helped us create a powerful online presence. Their attention to detail and commitment to quality is remarkable.",
    partner: {
      name: "Web Divine",
      logo: "/assets/images/partners/web-divine.png",
    },
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative px-4 py-16">
      <BlueBg className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform" />
      <div className="relative z-10 mx-auto">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            What Our Partners Say
          </h2>
          {/*  <p className="mx-auto max-w-2xl text-gray-300">
            Discover why leading companies trust Codebility to deliver
            exceptional digital solutions
          </p> */}
        </div>

        <div className="container">
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
            className="xl:px-20 py-0"
          >
            <CarouselContent className="xl:px-5 md:px-2">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="ml-5 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <TestimonialCard
                    quote={testimonial.quote}
                    partner={testimonial.partner}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="hidden h-full min-h-full xl:flex" />
            <CarouselNext className="hidden h-full min-h-full xl:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

interface TestimonialProps {
  quote: string;
  partner: {
    name: string;
    logo: string;
  };
}

export function TestimonialCard({ quote, partner }: TestimonialProps) {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-300">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between">
            <Quote className="h-10 w-10 text-purple-400 opacity-90" />
          </div>

          <blockquote className=" leading-relaxed text-gray-100">
            {quote}
          </blockquote>

          <div className="mt-auto flex items-center gap-4 border-t border-gray-700/50 pt-4">
            <div className="relative h-12 w-24 flex-shrink-0">
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                unoptimized={true}
                className="object-contain brightness-110"
                fill
                sizes="96px"
              />
            </div>
            <div className="hidden min-w-0 flex-1 sm:flex">
              <p className="truncate font-semibold text-white">
                {partner.name}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
