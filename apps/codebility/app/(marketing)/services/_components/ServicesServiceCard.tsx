import { useState } from "react";
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
}

interface Props {
  service: ServiceProject;
}

export default function ServiceCard({ service }: Props) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const {
    name,
    main_image,
    description,
    members = [],
    website_url,
    project_category_name,
  } = service;

  const imageUrl = main_image
    ? main_image.startsWith("public")
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/services-image/${main_image}`
      : main_image
    : "https://codebility-cdn.pages.dev/assets/images/default-avatar-1248x845.jpg";

  const hasValidWebsite =
    website_url &&
    website_url !== "" &&
    website_url.toLowerCase() !== "n/a" &&
    website_url !== ".";

  const teamLeader = members.length > 0 ? members[0] : null;
  const teamMembers = members.length > 1 ? members.slice(1) : [];
  const isDescriptionLong = description && description.length > 120;

  return (
    <div className="border-light-900/5 bg-light-700/10 flex h-full flex-1 flex-col rounded-lg border-2 p-4 text-white">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          priority
          quality={90}
        />
        {project_category_name && (
          <div className="absolute left-2 top-2 rounded-md bg-blue-600/80 px-2 py-1 text-xs text-white">
            {project_category_name}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <h3 className="mb-3 line-clamp-1 text-lg font-medium lg:text-2xl">
          {name}
        </h3>

        <div className="mb-4 min-h-[4.5rem]">
          <p
            className={`text-gray text-sm ${!isDescriptionExpanded ? "line-clamp-3" : ""}`}
          >
            {description || "No description available."}
          </p>
          {isDescriptionLong && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-1 text-xs text-blue-400 hover:text-blue-300"
            >
              {isDescriptionExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        <div className="mb-4 h-10">
          {hasValidWebsite && (
            <Link
              href={website_url!}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm transition-colors hover:bg-blue-700"
            >
              <IconLink className="size-4" />
              <span>View Website</span>
            </Link>
          )}
        </div>

        <div className="mt-auto min-h-[80px]">
          {members.length > 0 ? (
            <div>
              <p className="mb-2 text-sm text-gray-400">Team</p>
              <div className="flex flex-wrap items-end">
                {teamLeader && (
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="relative mb-2 mr-4">
                        <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-blue-500">
                          {teamLeader.image_url ? (
                            <Image
                              src={teamLeader.image_url}
                              alt={`${teamLeader.first_name} ${teamLeader.last_name}`}
                              fill
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
                      <div className="mb-2 mr-2">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-gray-700">
                          {member.image_url ? (
                            <Image
                              src={member.image_url}
                              alt={`${member.first_name} ${member.last_name}`}
                              fill
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
      </div>
    </div>
  );
}
