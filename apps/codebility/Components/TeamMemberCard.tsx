// src/components/TeamMemberCard.tsx
import { CodevData } from "@/types/home/codev";
import { Button } from "@/Components/ui/button";

interface TeamMemberCardProps {
  member: CodevData & { role: string };
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-light800_dark400 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <img
          src={member.image_url || "/assets/placeholder-avatar.png"}
          alt={`${member.first_name}'s avatar`}
          className="h-10 w-10 rounded-full object-cover border border-gray-300 dark:border-gray-700"
        />
        <div>
          <h3 className="font-semibold text-dark100_light900">
            {member.first_name} {member.last_name}
          </h3>
          <p className="text-sm text-gray-500">{member.role}</p>
        </div>
      </div>
      <Button variant="hollow" size="sm">
        <span className="hidden sm:inline">View Profile</span>
        <span className="sm:hidden">Profile</span>
      </Button>
    </div>
  );
}