import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"; // Updated to local path
import { Card, CardContent } from "@/Components/ui/card";
import { CodevData } from "@/types/home/codev";

interface Props {
  teamLeader: CodevData;
}

const TeamLeaderCard = ({ teamLeader }: Props) => {
  const fullName = `${teamLeader.first_name} ${teamLeader.last_name}`;
  const initials = `${teamLeader.first_name.charAt(0)}${teamLeader.last_name.charAt(0)}`;

  return (
    <Card className="w-full max-w-md">
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={teamLeader.image_url || ""} alt={fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{fullName}</h2>
          <p className="text-sm text-gray-500">Team Leader</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamLeaderCard;