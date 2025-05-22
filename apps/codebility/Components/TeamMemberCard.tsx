// apps/codebility/app/components/TeamMemberCard.tsx
import { CodevData } from "@/types/home/codev";
import { Button } from "@/Components/ui/button";

interface TeamMemberCardProps {
  member: CodevData & { role: string };
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200">
      <div className="flex items-center gap-4">
        <img
          src={member.image_url || "/assets/placeholder-avatar.png"}
          alt={`${member.first_name}'s avatar`}
          className="h-10 w-10 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h3 className="font-semibold text-gray-900">
            {member.first_name} {member.last_name}
          </h3>
          <p className="text-sm text-gray-600">{member.role}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700">Team Members:</p>
        <ul className="list-disc ml-6 text-sm text-gray-600">
          {/* Add logic to display team members here */}
        </ul>
      </div>
      <Button variant="hollow" size="sm" className="mt-4 text-blue-600 border-blue-600 hover:bg-blue-50">
        Mentors
      </Button>
    </div>
  );
}