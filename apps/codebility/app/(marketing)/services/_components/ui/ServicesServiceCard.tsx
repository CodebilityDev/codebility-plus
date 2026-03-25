"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
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

  const [isHovered, setIsHovered] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isHovered) {
      setShowDescription(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
      return;
    }

    // After 2s on hover, switch to description
    timerRef.current = setTimeout(() => {
      setShowDescription(true);
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isHovered]);

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
      <div
        className="relative aspect-[4/3] w-full overflow-hidden"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1536px) 16vw, (min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          quality={75}
        />

        {/* Category badges — dark glass pill */}
        {categories.length > 0 && (
          <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5">
            {categories.map((category) => (
              <span
                key={category.id}
                className="rounded-md border border-white/10 bg-gray-950/75 px-2.5 py-1 text-[11px] font-semibold text-white/90"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Bottom glass band — grows from single-line to 40% max on description */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-white/10 bg-gray-950/75 px-4 py-3"
          style={{
            opacity: isHovered ? 1 : 0,
            maxHeight: showDescription ? "40%" : "auto",
            transition: "opacity 300ms cubic-bezier(0.4,0,0.2,1), max-height 300ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {!showDescription && (
            <span
              className="flex items-center gap-2 text-sm font-semibold text-white/90"
              style={{
                animation: "fadeSlideIn 300ms cubic-bezier(0.4,0,0.2,1) both",
              }}
            >
              <Eye className="size-4 text-white/60" />
              View Project
            </span>
          )}
          {showDescription && (
            <span
              className="block overflow-hidden text-ellipsis text-[13px] leading-relaxed text-white/80"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                animation: "fadeSlideIn 300ms cubic-bezier(0.4,0,0.2,1) both",
              }}
            >
              {description || "No description available."}
            </span>
          )}
        </div>

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
