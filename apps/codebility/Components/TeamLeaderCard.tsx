// apps/codebility/app/components/TeamLeaderCard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { CodevData } from "@/types/home/codev";

interface Props {
  teamLeader: CodevData;
}

const TeamLeaderCard = ({ teamLeader }: Props) => {
  const fullName = `${teamLeader.first_name} ${teamLeader.last_name}`;
  const initials = `${teamLeader.first_name.charAt(0)}${teamLeader.last_name.charAt(0)}`;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 text-center transition-transform hover:scale-105">
      <div className="relative">
        <Avatar className="h-20 w-20 mx-auto mb-2 border-2 border-gray-700">
          <AvatarImage src={teamLeader.image_url || ""} alt={fullName} />
          <AvatarFallback className="bg-gray-700 text-white text-lg">{initials}</AvatarFallback>
        </Avatar>
        {teamLeader.is_online && (
          <div className="absolute bottom-0 right-0 bg-green-500 h-2 w-2 rounded-full border-2 border-white"></div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-100">{fullName}</h3>
      <p className="text-sm text-gray-400">Team Leader</p>
    </div>
  );
};

export default TeamLeaderCard;