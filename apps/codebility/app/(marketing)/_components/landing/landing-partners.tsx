import Image from "next/image";
import bradWell from "@/public/assets/images/partners/bradwell.png";
import federalPlans from "@/public/assets/images/partners/federal-plans.png";
import geniusWebservices from "@/public/assets/images/partners/genius-web-services.png";
import infraspan from "@/public/assets/images/partners/infraspan.png";
import netmedia from "@/public/assets/images/partners/netmedia.png";
import travelTribe from "@/public/assets/images/partners/travel-tribe.png";
import zwiftTech from "@/public/assets/images/partners/zwift-tech.png";

export default function Partners() {
  const topPartners = [
    { name: "Infraspan", logo: infraspan },
    { name: "Federal PLANS", logo: federalPlans },
    { name: "Genius Web Services", logo: geniusWebservices },
  ];
  const bottomPartners = [
    { name: "Travel Tribe", logo: travelTribe },
    { name: "netmedia", logo: netmedia },
    { name: "zwift Tech", logo: zwiftTech },
    { name: "Bradwell", logo: bradWell },
  ];

  return (
    <div className="mx-auto w-full max-w-screen-lg p-8 py-36 text-white">
      <h2 className="mb-5 text-center text-4xl font-bold sm:text-6xl">
        Our Partners
      </h2>
      <p className="mb-8 text-center text-sm sm:text-xl">
        Meet Our Trusted Partners
      </p>
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-6 md:grid-cols-1 lg:grid-cols-3">
          {topPartners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center"
            >
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                className=" object-contain"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {bottomPartners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center"
            >
              <Image
                src={partner.logo}
                alt={`${partner.name} logo`}
                className=" object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
