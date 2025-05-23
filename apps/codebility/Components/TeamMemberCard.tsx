import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { CodevData } from "@/types/home/codev";

interface Props {
  member: CodevData;
}

const TeamMemberCard = ({ member }: Props) => {
  const fullName = `${member.first_name} ${member.last_name}`;
  const initials = `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`;

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-md shadow-md transition-transform hover:scale-102 hover:shadow-lg">
      <div className="relative">
        <Avatar className="h-10 w-10 border border-gray-600">
          <AvatarImage src={member.image_url || "/assets/placeholder-avatar.png"} alt={fullName} />
          <AvatarFallback className="bg-gray-700 text-white text-sm">{initials}</AvatarFallback>
        </Avatar>
        {member.is_online && (
          <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{fullName}</p>
        <p className="text-xs text-white opacity-75">Member</p>
      </div>
    </div>
  );
};

export default TeamMemberCard;