import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import Container from "../MarketingContainer";

const WORK_WITH_US_CARDS = [
  {
    id: "portfolio",
    title: "Our Portfolio",
    image: {
      src: "https://codebility-cdn.pages.dev/assets/images/index/projects-large.jpg",
      alt: "portfolio projects",
    },
    description:
      "Build your next digital experience with a team that delivers reliable, cutting-edge work from discovery to launch.",
    link: {
      href: "/services",
      text: "Explore Work",
    },
  },
  {
    id: "hire-developers",
    title: "Hire Developers",
    image: {
      src: "https://codebility-cdn.pages.dev/assets/images/index/codevs-large.jpg",
      alt: "professional developers",
    },
    description:
      "Accelerate delivery with vetted engineers, designers, and strategists who integrate seamlessly with your roadmap.",
    link: {
      href: "/hire-a-codev",
      text: "Hire CoDevs",
    },
  },
  {
    id: "developer-journey",
    title: "Be a Codev",
    image: {
      src: "/assets/images/index/image.png",
      alt: "become a codev developer",
    },
    description:
      "Join our community, sharpen your craft through real projects, and unlock career opportunities across the globe.",
    link: {
      href: "/codevs",
      text: "Join the Program",
    },
  },
  {
    id: "careers",
    title: "Career Opportunities",
    image: {
      src: "/assets/images/services/black-and-purple-abstract.png",
      alt: "career opportunities and job openings04",
    },
    description:
      "Explore exciting career opportunities with our team. Join a dynamic environment where innovation meets collaboration.",
    link: {
      href: "/careers",
      text: "View Careers",
    },
  },
];

const WorkWithUsCard = ({ card, index }: { card: (typeof WORK_WITH_US_CARDS)[number]; index: number }) => (
  <div className="group relative w-full">
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/60 via-purple-400/40 to-purple-900/20 opacity-80 blur-2xl transition-all duration-500 group-hover:opacity-100" />
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 bg-gradient-to-br from-white/10 via-white/5 to-purple-950/20 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-300/60 hover:shadow-purple-500/20 md:p-8">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={card.image.src}
            alt={card.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={index === 0}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-950/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-8 flex flex-col gap-6 text-white md:mt-10">
        <h3 className="text-2xl font-semibold md:text-3xl">{card.title}</h3>
        <p className="text-base leading-relaxed text-white/75 md:text-lg">{card.description}</p>
        <div className="pt-2">
          <Link href={card.link.href} className="inline-block">
            <Button variant="purple" size="lg" rounded="full" className="shadow-lg shadow-purple-500/20">
              {card.link.text}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const WorkWithUs = () => {
  return (
    <section
      id="workwithus"
      className="relative flex w-full items-center py-16 md:py-24 overflow-hidden"
    >
      <div className="pointer-events-none absolute left-0 top-16 hidden h-64 w-64 rounded-full bg-purple-600/30 blur-3xl md:block" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 text-white md:px-6 lg:px-8">
        <div className="flex w-full max-w-4xl flex-col items-center gap-6 text-center md:gap-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-purple-200">
            Work With Us
          </span>
          <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
            Build meaningful products with a partner that keeps momentum high.
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
            Whether you need a seasoned project team, specialist talent, or a launchpad for your own journey, Codebility brings
            world-class execution, mentorship, and community to every collaboration.
          </p>
        </div>

        <div className="mt-14 grid w-full grid-cols-1 gap-8 md:mt-20 md:grid-cols-2 md:gap-10 lg:gap-12">
          {WORK_WITH_US_CARDS.map((card, index) => (
            <WorkWithUsCard key={card.id} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkWithUs;
