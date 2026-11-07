import Image from "next/image";

import { cn } from "@codevs/ui";

export type ClientLogoName = "netmedia" | "zwift-tech" | "infraspan" | "averps";

const logoSources: Record<ClientLogoName, string> = {
  netmedia: "/assets/images/partners/netmedia.png",
  "zwift-tech": "/assets/images/partners/zwift-tech.png",
  infraspan: "/assets/images/partners/infraspan.png",
  averps: "/assets/images/partners/averps.png",
};

const logoAlt: Record<ClientLogoName, string> = {
  netmedia: "Netmedia",
  "zwift-tech": "Zwift Tech",
  infraspan: "Infraspan",
  averps: "Averps",
};

export interface ClientLogoProps {
  name: ClientLogoName;
  alt?: string;
  className?: string;
}

function ClientLogo({ name, alt, className }: ClientLogoProps) {
  return (
    <span className={cn("relative block h-10 w-[140px]", className)}>
      <Image
        src={logoSources[name]}
        alt={alt ?? logoAlt[name]}
        fill
        sizes="140px"
        className="object-contain object-left"
      />
    </span>
  );
}

export { ClientLogo };
