import Image from "next/image";
import Section from "../MarketingSection";

const partners = [
  {
    name: "Genius Web Services",
    logo: "/assets/images/partners/genius-web-services.png",
  },
  { name: "Travel Tribe", logo: "/assets/images/partners/travel-tribe.png" },
  { name: "Netmedia", logo: "/assets/images/partners/netmedia.png" },
  { name: "Zwift Tech", logo: "/assets/images/partners/zwift-tech.png" },
  { name: "Bradwell", logo: "/assets/images/partners/bradwell.png" },
  { name: "Ai", logo: "/assets/images/partners/ai.png" },
  { name: "Averps", logo: "/assets/images/partners/averps.png" },
  { name: "Tolle Design", logo: "/assets/images/partners/tolle-design.png" },
  { name: "Infraspan", logo: "/assets/images/partners/infraspan.png" },
  {
    name: "Federal PLANS",
    logo: "/assets/images/partners/federal-plans.png",
  },
  { name: "Web Divine", logo: "/assets/images/partners/web-divine.png" },
  { name: "FixFlow.ai", logo: "/assets/images/partners/fixflow-ai.png" },
];

export default function Partners() {
  return (
    <Section id="partners" className="relative w-full pt-10 text-white">
      <div className="mx-auto w-full max-w-screen-lg px-8 py-8 text-white">
        <h2 className="mb-6 text-center text-4xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent sm:text-5xl">
          Our Partners
        </h2>
        
        <p className="mb-12 text-center text-lg text-gray-300 sm:text-xl">
          Meet Our Trusted Partners
        </p>
        
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="group relative flex h-32 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300"
            >
              <div className="relative z-10 h-full w-full">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  fill
                  className="object-contain filter group-hover:brightness-110 transition-all duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
