import Image from "next/image";

import { cn } from "@codevs/ui";

export type ClientLogoName =
  | "ai"
  | "averps"
  | "bradwell"
  | "federal-plans"
  | "fixflow-ai"
  | "genius-web-services"
  | "infraspan"
  | "netmedia"
  | "tolle-design"
  | "travel-tribe"
  | "web-divine"
  | "zwift-tech";

const logoSources: Record<ClientLogoName, string> = {
  ai: "/assets/images/partners/ai.png",
  averps: "/assets/images/partners/averps.png",
  bradwell: "/assets/images/partners/bradwell.png",
  "federal-plans": "/assets/images/partners/federal-plans.png",
  "fixflow-ai": "/assets/images/partners/fixflow-ai.png",
  "genius-web-services": "/assets/images/partners/genius-web-services.png",
  infraspan: "/assets/images/partners/infraspan.png",
  netmedia: "/assets/images/partners/netmedia.png",
  "tolle-design": "/assets/images/partners/tolle-design.png",
  "travel-tribe": "/assets/images/partners/travel-tribe.png",
  "web-divine": "/assets/images/partners/web-divine.png",
  "zwift-tech": "/assets/images/partners/zwift-tech.png",
};

const logoScale: Partial<Record<ClientLogoName, string>> = {
  bradwell: "scale-[1.4]",
  "travel-tribe": "scale-[1.3]",
};

const logoBlend: Partial<Record<ClientLogoName, string>> = {
  "travel-tribe": "mix-blend-screen",
};

const logoAlt: Record<ClientLogoName, string> = {
  ai: "AI",
  averps: "Averps",
  bradwell: "Bradwell",
  "federal-plans": "Federal Plans",
  "fixflow-ai": "FixFlow.ai",
  "genius-web-services": "Genius Web Services",
  infraspan: "Infraspan",
  netmedia: "Netmedia",
  "tolle-design": "TW Tolle Web Design",
  "travel-tribe": "Travel Tribe",
  "web-divine": "Web Divine",
  "zwift-tech": "Zwift Tech",
};

export interface ClientLogoProps {
  name: ClientLogoName;
  alt?: string;
  className?: string;
}

function ClientLogo({ name, alt, className }: ClientLogoProps) {
  return (
    <span
      className={cn(
        "relative block h-[52px] w-[120px] sm:h-[var(--cb-size-64)] sm:w-[170px]",
        logoBlend[name],
        className,
      )}
    >
      <Image
        src={logoSources[name]}
        alt={alt ?? logoAlt[name]}
        fill
        sizes="(min-width: 640px) 170px, 120px"
        className={cn("object-contain object-center", logoScale[name])}
      />
    </span>
  );
}

export { ClientLogo };
