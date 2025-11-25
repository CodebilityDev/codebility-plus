import Image from "next/image";
import { defaultAvatar } from "@/public/assets/images";
import { getValidImageUrl } from "@/utils/imageValidation";

import { Card, CardContent } from "@codevs/ui/card";

import { TeamMemberCardProps } from "../_types/org-chart";

// Line 8: Added id destructuring and onClick handler with hover effects
export const TeamMemberCard = ({
  id,
  first_name,
  last_name,
  display_position,
  image_url,
}: TeamMemberCardProps) => {
  const validImageUrl = getValidImageUrl(image_url);
  
  // Line 15: Card wrapper now clickable with cursor pointer and enhanced hover
  return (
    <Card 
      onClick={() => window.location.href = `https://www.codebility.tech/profiles/${id}`}
      className="group relative h-32 w-36 overflow-hidden border-2 border-gray-200 shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.02] dark:border-gray-700"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-customBlue-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardContent className="relative flex h-full flex-col items-center justify-center gap-1 p-2">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-customBlue-500 to-purple-500 opacity-0 blur transition-opacity duration-300 group-hover:opacity-75" />
          <Image
            src={validImageUrl || defaultAvatar}
            alt={`${first_name} ${last_name}`}
            width={48}
            height={48}
            priority
            quality={95}
            unoptimized={false}
            className="relative h-12 w-12 rounded-full border-2 border-white object-cover shadow-lg dark:border-gray-700"
          />
        </div>
        <div className="text-center">
          <h3 className="text-xs font-semibold capitalize text-gray-900 dark:text-white">{`${first_name} ${last_name}`}</h3>
          <p className="text-[10px] text-gray-600 dark:text-gray-400">
            {display_position}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};