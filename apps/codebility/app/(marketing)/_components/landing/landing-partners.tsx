import Image from "next/image";

export default function Partners() {
  const partners = [
    { name: "Infraspan", logo: "/assets/images/partners/infraspan.png" },
    {
      name: "Federal PLANS",
      logo: "/assets/images/partners/federal-plans.png",
    },
    {
      name: "Genius Web Services",
      logo: "/assets/images/partners/genius-web-services.png",
    },
    { name: "Travel Tribe", logo: "/assets/images/partners/travel-tribe.png" },
    { name: "netmedia", logo: "/assets/images/partners/netmedia.png" },
    { name: "zwift Tech", logo: "/assets/images/partners/zwift-tech.png" },
    { name: "Bradwell", logo: "/assets/images/partners/bradwell.png" },
    { name: "Ai", logo: "/assets/images/partners/ai.png" },
    { name: "Averps", logo: "/assets/images/partners/averps.png" },
  ];

  return (
    <div className="mx-auto w-full max-w-screen-lg p-8 py-36 text-white">
      <h2 className="mb-5 text-center text-4xl font-bold sm:text-6xl">
        Our Partners
      </h2>
      <p className="mb-8 text-center text-sm sm:text-xl">
        Meet Our Trusted Partners
      </p>
      <div className="mt-14 space-y-16">
        <div className="grid grid-cols-2 items-center justify-center gap-8 md:grid-cols-3">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className={`relative flex aspect-video w-full items-center justify-center ${
                partner.name === "Travel Tribe"
                  ? "h-20"
                  : partner.name === "netmedia" || partner.name === "zwift Tech"
                    ? "h-10"
                    : partner.name === "Bradwell" || partner.name === "Ai"
                      ? "h-24"
                      : partner.name === "Averps"
                        ? "h-10"
                        : "h-12"
              }`}
            >
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                className=" object-contain"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
