import { useState, memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import DefaultAvatar from "@/components/DefaultAvatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconLink } from "@/public/assets/svgs";
import { Crown } from "lucide-react";

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

interface ServiceProject {
  id: string;
  name: string;
  description?: string;
  main_image?: string;
  github_link?: string;
  figma_link?: string;
  start_date?: string;
  end_date?: string;
  members?: TeamMember[];
  project_category_id?: number;
  project_category_name?: string;
  client_id?: string;
  created_at?: string;
  updated_at?: string;
  website_url?: string;
  tech_stack?: string[];
}

interface Props {
  service: ServiceProject;
}

function ServiceCard({ service }: Props) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const {
    name,
    main_image,
    description,
    members = [],
    website_url,
    project_category_name,
    tech_stack = [],
  } = service;

  const imageUrl = useMemo(() => 
    main_image
      ? main_image.startsWith("public")
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/services-image/${main_image}`
        : main_image
      : "https://codebility-cdn.pages.dev/assets/images/default-avatar-1248x845.jpg"
  , [main_image]);

  const hasValidWebsite = useMemo(() =>
    website_url &&
    website_url !== "" &&
    website_url.toLowerCase() !== "n/a" &&
    website_url !== "."
  , [website_url]);

  const { teamLeader, teamMembers, isDescriptionLong } = useMemo(() => ({
    teamLeader: members.length > 0 ? members[0] : null,
    teamMembers: members.length > 1 ? members.slice(1) : [],
    isDescriptionLong: description && description.length > 120
  }), [members, description]);

  return (
    <div 
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/30 hover:bg-white/10 transform-gpu hover:-translate-y-2 hover:scale-105 aspect-[3/4]"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseEnter={(e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.01)`;
      }}
      onMouseLeave={(e) => {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
      }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden flex-shrink-0">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-105"
          loading="lazy"
          quality={75}
        />
        {project_category_name && (
          <div className="absolute left-3 top-3 inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white rounded-full backdrop-blur-sm shadow-lg bg-blue-600/80 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/20">
            {project_category_name}
          </div>
        )}
        
        {/* 3D Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <div className="flex flex-1 flex-col p-4 text-white transition-all duration-500 group-hover:translate-z-4">
        {/* Main Content */}
        <div className="flex-1 space-y-3">
          <h3 className="line-clamp-1 text-lg font-bold group-hover:text-blue-300 transition-colors lg:text-xl">
            {name}
          </h3>

          <div className="min-h-[4rem]">
            <p
              className={`text-gray-300 text-sm leading-relaxed ${!isDescriptionExpanded ? "line-clamp-3" : ""}`}
            >
              {description || "No description available."}
            </p>
            {isDescriptionLong && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {isDescriptionExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Tech Stack */}
          {tech_stack && tech_stack.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {tech_stack.slice(0, 4).map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-500/30 hover:shadow-sm hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-indigo-500/30 hover:border-blue-400/40 animate-fade-in-up group-hover:translate-y-[-1px]"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    {tech}
                  </span>
                ))}
                {tech_stack.length > 4 && (
                  <span 
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-600/20 to-gray-500/20 text-gray-300 border border-gray-500/30 hover:scale-110 transition-all duration-300 animate-fade-in-up"
                    style={{
                      animationDelay: `${4 * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    +{tech_stack.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section with Website Button Absolute Positioned */}
        <div className="relative space-y-4 mt-auto">
          {/* Team Section */}
          {members.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Team</p>
              <div className="flex flex-wrap items-end">
                {teamLeader && (
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="relative mb-2 mr-2">
                        <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-customBlue-500">
                          {teamLeader.image_url ? (
                            <Image
                              src={teamLeader.image_url}
                              alt={`${teamLeader.first_name} ${teamLeader.last_name}`}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <DefaultAvatar
                              size={56}
                              className="h-full w-full"
                            />
                          )}
                        </div>
                        <Crown className="absolute -right-2 -top-2 h-4 w-6 rotate-45 text-yellow-400 drop-shadow-lg" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {teamLeader.first_name} {teamLeader.last_name} (Lead)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {teamMembers.map((member, index) => (
                  <Tooltip key={`${member.id}${index}`}>
                    <TooltipTrigger>
                      <div className="mb-2 mr-1">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-gray-700">
                          {member.image_url ? (
                            <Image
                              src={member.image_url}
                              alt={`${member.first_name} ${member.last_name}`}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <DefaultAvatar
                              size={40}
                              className="h-full w-full"
                            />
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>
                        {member.first_name} {member.last_name}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-end">
              <p className="text-sm text-gray-400">No team members assigned</p>
            </div>
          )}
        </div>

        {/* Website Button - Absolute positioned at bottom right */}
        {hasValidWebsite && (
          <Link
            href={website_url!}
            target="_blank"
            className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/30 hover:border-blue-300/50 px-3 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:translate-y-[-1px] backdrop-blur-sm"
          >
            <IconLink className="size-4" />
            <span>View</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default memo(ServiceCard);
