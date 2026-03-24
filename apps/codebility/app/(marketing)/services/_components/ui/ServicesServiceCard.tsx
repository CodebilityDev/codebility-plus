"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconLink } from "@/public/assets/svgs";
import { Eye } from "lucide-react";

import { useServiceContext } from "../../_context";

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
  role?: string;
  joined_at?: string;
}

export interface ServiceProject {
  id: string;
  name: string;
  description?: string;
  main_image?: string;
  github_link?: string;
  figma_link?: string;
  start_date?: string;
  end_date?: string;
  members?: TeamMember[];
  categories?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
  client_id?: string;
  created_at?: string;
  updated_at?: string;
  website_url?: string;
  tech_stack?: string[];
}

interface Props {
  service: ServiceProject;
  onSelect?: (service: ServiceProject) => void;
}

export const ServicesServiceCard = memo(({ service, onSelect }: Props) => {
  const { setActiveService } = useServiceContext();

  const {
    name,
    main_image,
    description,
    members = [],
    website_url,
    categories = [],
    tech_stack = [],
  } = service;

  const imageUrl = useMemo(
    () =>
      main_image
        ? main_image.startsWith("public")
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/services-image/${main_image}`
          : main_image
        : "https://codebility-cdn.pages.dev/assets/images/default-avatar-1248x845.jpg",
    [main_image],
  );

  const hasValidWebsite = useMemo(
    () =>
      website_url &&
      website_url !== "" &&
      website_url.toLowerCase() !== "n/a" &&
      website_url !== ".",
    [website_url],
  );

  const teamLeader = useMemo(
    () => members.find((member) => member.role === "team_leader") || null,
    [members],
  );

  const handleClick = () => {
    if (onSelect) {
      onSelect(service);
    } else {
      setActiveService(service);
    }
  };

  return (
    <div className="group cursor-pointer overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] transition-all duration-300 hover:bg-white/[0.07] hover:ring-white/[0.16] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
      {/* Image — consistent 4:3 aspect ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden" onClick={handleClick}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1536px) 16vw, (min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          quality={75}
        />

        {/* Hover overlay with action */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
          <div className="flex translate-y-3 items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 opacity-0 shadow-xl backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Eye className="size-4" />
            View Project
          </div>
        </div>

        {/* Category badges — top left */}
        {categories.length > 0 && (
          <div className="absolute left-2.5 top-2.5 flex max-w-[calc(100%-1.25rem)] flex-wrap gap-1">
            {categories.map((category) => (
              <span
                key={category.id}
                className="rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-md"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Website link — top right */}
        {hasValidWebsite && (
          <Link
            href={website_url!}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-white hover:text-gray-900 group-hover:opacity-100"
          >
            <IconLink className="size-3.5" />
          </Link>
        )}
      </div>

      {/* Footer — single line: name + author */}
      <div className="flex items-center gap-2 px-3 py-2.5" onClick={handleClick}>
        <h3 className="min-w-0 flex-1 truncate text-sm font-medium text-white/80 transition-colors group-hover:text-white">
          {name}
        </h3>
        {teamLeader && (
          <span className="flex-shrink-0 truncate text-xs text-white/35">
            {teamLeader.first_name} {teamLeader.last_name}
          </span>
        )}
      </div>
    </div>
  );
});
