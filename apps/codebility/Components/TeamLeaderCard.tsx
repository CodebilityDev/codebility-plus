import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { CodevData } from "@/types/home/codev";

interface Props {
  teamLeader: CodevData;
}

const TeamLeaderCard = ({ teamLeader }: Props) => {
  const fullName = `${teamLeader.first_name} ${teamLeader.last_name}`;
  const initials = `${teamLeader.first_name.charAt(0)}${teamLeader.last_name.charAt(0)}`;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 text-center transition-transform hover:scale-105 hover:shadow-xl">
      <div className="relative inline-block">
        <Avatar className="h-20 w-20 mx-auto mb-3 border-2 border-gray-600">
          <AvatarImage src={teamLeader.image_url || "/assets/placeholder-avatar.png"} alt={fullName} />
          <AvatarFallback className="bg-gray-700 text-white text-lg">{initials}</AvatarFallback>
        </Avatar>
        {teamLeader.is_online && (
          <div className="absolute bottom-1 right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-white">{fullName}</h3>
      <p className="text-sm text-white opacity-75">Team Leader</p>
    </div>
  );
};

export default TeamLeaderCard;