import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Card, CardContent } from "@/Components/ui/card";
import { CodevData } from "@/types/home/codev";

interface Props {
  member: CodevData;
}

const TeamMemberCard = ({ member }: Props) => {
  const fullName = `${member.first_name} ${member.last_name}`;
  const initials = `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`;

  return (
    <Card className="w-full max-w-xs">
      <CardContent className="flex flex-col items-center gap-2 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={member.image_url || ""} alt={fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="text-sm font-medium">{fullName}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;