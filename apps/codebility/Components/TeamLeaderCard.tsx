import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { CodevData } from "@/types/home/codev";
import Link from "next/link";

interface Props {
  teamLeader: CodevData;
}

const TeamLeaderCard = ({ teamLeader }: Props) => {
  const fullName = `${teamLeader.first_name} ${teamLeader.last_name}`;
  const initials = `${teamLeader.first_name.charAt(0)}${teamLeader.last_name.charAt(0)}`;

  return (
    <Link href={`/home/profile/${teamLeader.id}`} className="block">
      <div className="bg-gray-700 rounded-lg shadow-md p-4 text-center transition-all hover:bg-gray-600">
        <div className="relative inline-block">
          <Avatar className="h-20 w-20 mx-auto mb-3 border-2 border-gray-600">
            <AvatarImage src={teamLeader.image_url || "/assets/placeholder-avatar.png"} alt={fullName} />
            <AvatarFallback className="bg-gray-800 text-white text-lg">{initials}</AvatarFallback>
          </Avatar>
          {teamLeader.is_online && (
            <div className="absolute bottom-1 right-1 h-3 w-3 bg-green-500 rounded-full border border-gray-900"></div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-white">{fullName}</h3>
        <p className="text-sm text-white opacity-75">Team Leader</p>
      </div>
    </Link>
  );
};

export default TeamLeaderCard;