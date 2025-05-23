// apps/codebility/app/components/TeamMemberCard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { CodevData } from "@/types/home/codev";

interface Props {
  member: CodevData;
}

const TeamMemberCard = ({ member }: Props) => {
  const fullName = `${member.first_name} ${member.last_name}`;
  const initials = `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`;

  return (
    <div className="flex items-center gap-3 p-2 bg-gray-800 rounded-md shadow-sm transition-transform hover:scale-105">
      <div className="relative">
        <Avatar className="h-10 w-10 border border-gray-700">
          <AvatarImage src={member.image_url || ""} alt={fullName} />
          <AvatarFallback className="bg-gray-700 text-white text-sm">{initials}</AvatarFallback>
        </Avatar>
        {member.is_online && (
          <div className="absolute bottom-0 right-0 bg-green-500 h-2 w-2 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-100">{fullName}</p>
        <p className="text-xs text-gray-400">Member</p>
      </div>
    </div>
  );
};

export default TeamMemberCard;