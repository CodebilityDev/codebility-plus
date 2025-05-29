import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { CodevData } from "@/types/home/codev";
import Link from "next/link";

interface Props {
  member: CodevData;
}

const TeamMemberCard = ({ member }: Props) => {
  const fullName = `${member.first_name} ${member.last_name}`;
  const initials = `${member.first_name.charAt(0)}${member.last_name.charAt(0)}`;

  return (
    <Link href={`/home/profile/${member.id}`} className="block">
      <div className="bg-gray-700 rounded-full h-20 w-20 flex items-center justify-center shadow-md transition-all hover:bg-gray-600">
        <div className="relative">
          <Avatar className="h-16 w-16">
            <AvatarImage src={member.image_url || "/assets/placeholder-avatar.png"} alt={fullName} />
            <AvatarFallback className="bg-gray-800 text-white text-sm">{initials}</AvatarFallback>
          </Avatar>
          {member.is_online && (
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border border-gray-900"></div>
          )}
        </div>
        <span className="sr-only">{fullName}</span> {/* Screen reader only */}
      </div>
    </Link>
  );
};

export default TeamMemberCard;