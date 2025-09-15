import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import Container from "../MarketingContainer";
import Section from "../MarketingSection";

// Card data array for DRY principle - Single source of truth for card content
const WORK_WITH_US_CARDS = [
  {
    id: "portfolio",
    title: "Our Portfolio",
    image: {
      src: "https://codebility-cdn.pages.dev/assets/images/index/projects-large.jpg",
      alt: "portfolio projects"
    },
    description: "Build your own website with us today and ensure a reliable, cutting-edge online presence.",
    link: {
      href: "/services",
      text: "Our Portfolio"
    }
  },
  {
    id: "hire-developers", 
    title: "Hire Developers",
    image: {
      src: "https://codebility-cdn.pages.dev/assets/images/index/codevs-large.jpg",
      alt: "professional developers"
    },
    description: "Connect with the best developer to meet your needs through our top-rated professionals.",
    link: {
      href: "/codevs",
      text: "Hire a CoDev"
    }
  },
  {
    id: "developer-journey",
    title: "Developer Journey", 
    image: {
      src: "/assets/images/index/image.png",
      alt: "developer learning journey phases"
    },
    description: "Connect with our developer community and explore exciting career opportunities in tech.",
    link: {
      href: "/auth/onboarding",
      text: "Apply as Codev"
    }
  }
];

// Reusable card component following Single Responsibility Principle
const WorkWithUsCard = ({ card }: { card: typeof WORK_WITH_US_CARDS[0] }) => (
  <Container className="relative z-10 mx-auto max-w-[600px] px-4 text-white">
    <div className="border-light-900/5 bg-light-700/10 flex h-full flex-col gap-4 rounded-lg border-2 p-6 md:p-8">
      {/* Image section with consistent aspect ratio */}
      <div className="aspect-[500/359] w-full overflow-hidden rounded-xl">
        <Image
          src={card.image.src}
          alt={card.image.alt}
          width={500}
          height={359}
          className="h-full w-full object-cover"
          priority={card.id === "portfolio"} // Prioritize first image loading
        />
      </div>
      
      {/* Content section with consistent spacing */}
      <div className="flex flex-col gap-6">
        <p className="text-center text-sm leading-relaxed md:text-base">
          {card.description}
        </p>
        
        {/* Button section - centered for single section layout */}
        <div className="flex justify-center">
          <Link href={card.link.href}>
            <Button variant="purple" size="lg" rounded="full">
              {card.link.text}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </Container>
);

// Background decoration component for DRY principle
const BackgroundDecoration = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden blur-3xl"
  >
    <div
      style={{
        clipPath: "polygon(22.1% 28.3%, 6% 40.5%, 0.8% 63.5%, 9.3% 84.8%, 23.6% 88.5%, 48.9% 88.8%, 77.2% 88.5%, 92.4% 71.5%, 93.9% 51.5%, 85.9% 36.8%, 70% 29.5%, 46.1% 29%)",
      }}
      className="relative aspect-[855/678] w-[40rem] bg-gradient-to-r from-[#00738B] via-[#0C3FDB] to-[#9707DD] opacity-20 sm:w-[72.1875rem]"
    />
  </div>
);

const WorkWithUs = () => {
  return (
    <>
      {/* Main title section */}
      <Section
        id="workwithus"
        className="border-light-900/5 bg-light-900/5 relative w-full border-t-4"
      >
        <Container className="relative z-10 mx-auto max-w-[1100px] px-4 text-white">
          <h2 className="text-center text-xl md:text-3xl pt-1 pb-0 mb-0 -mb-16">Work With Us</h2>
        </Container>
        <BackgroundDecoration />
      </Section>

      {/* Three separate sections - each card gets its own section */}
      {WORK_WITH_US_CARDS.map((card, index) => (
        <Section
          key={card.id}
          className={`border-light-900/5 bg-light-900/5 relative w-full ${
            index === WORK_WITH_US_CARDS.length - 1 ? 'border-b-4' : ''
          }`}
        >
          <div className="pt-0 pb-0 -mt-20">
            <WorkWithUsCard card={card} />
          </div>
          <BackgroundDecoration />
        </Section>
      ))}
    </>
  );
};

export default WorkWithUs;