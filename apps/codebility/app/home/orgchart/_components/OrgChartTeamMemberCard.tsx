import Image from "next/image";
import { defaultAvatar } from "@/public/assets/images";

import { Card, CardContent } from "@codevs/ui/card";

import { TeamMemberCardProps } from "../_types/org-chart";

export const TeamMemberCard = ({
  profile_id,
}: TeamMemberCardProps) => {
  if (!profile_id) {
    return null;
  }

  const { first_name, last_name, main_position, image_url } = profile_id;

  return (
    <Card className="w-48 shadow-lg">
      <CardContent className="flex flex-col items-center gap-2 p-4">
        <Image
          src={image_url || defaultAvatar}
          alt={`${first_name} url`}
          width={80}
          height={80}
          priority
          className="rounded-full object-cover"
        />
        <h3 className="text-center font-semibold capitalize">{`${first_name} ${last_name}`}</h3>
        <p className="text-center text-sm text-muted-foreground">
          {main_position}
        </p>
      </CardContent>
    </Card>
  )}