import Image from "next/image";
import { defaultAvatar } from "@/public/assets/images";

import { Card, CardContent } from "@codevs/ui/card";

import { TeamMemberCardProps } from "../_types/org-chart";

export const TeamMemberCard = ({
  first_name,
  last_name,
  display_position,
  image_url,
}: TeamMemberCardProps) => {
  return (
    <div className="h-48 w-52 dark:bg-transparent">
      <CardContent className="flex flex-col items-center gap-2 p-4">
        <Image
          src={image_url || defaultAvatar}
          alt={`${first_name} url`}
          width={80}
          height={80}
          priority
          unoptimized={true}
          className="h-20 w-20 rounded-full object-cover"
        />
        <h3 className="text-center font-semibold capitalize">{`${first_name} ${last_name}`}</h3>
        <p className="text-center text-sm text-muted-foreground">
          {display_position}
        </p>
      </CardContent>
    </div>
  );
};
