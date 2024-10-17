import Image from "next/image";

import { Card, CardContent } from "@codevs/ui/card";

export const TeamMemberCard = ({ name, title, image }: any) => (
  <Card className="w-48 shadow-lg">
    <CardContent className="flex flex-col items-center p-4">
      <Image
        src={image}
        alt={name}
        width={80}
        height={80}
        className="mb-2 rounded-full bg-black-200"
      />
      <h3 className="text-center font-semibold">{name}</h3>
      <p className="text-center text-sm text-muted-foreground">{title}</p>
    </CardContent>
  </Card>
);
