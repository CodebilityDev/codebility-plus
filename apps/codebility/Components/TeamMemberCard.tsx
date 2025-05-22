// apps/codebility/app/components/TeamLeaderCard.tsx
import { CodevData } from "@/types/home/codev";
import { Button } from "@/Components/ui/button";

interface TeamLeaderCardProps {
  teamLeader: CodevData & { role: string };
  teamMembers: CodevData[];
}

export default function TeamMemberCard({ teamLeader, teamMembers }: TeamLeaderCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border border-gray-200">
      <div className="flex items-center gap-4">
        <img
          src={teamLeader.image_url || "/assets/placeholder-avatar.png"}
          alt={`${teamLeader.first_name}'s avatar`}
          className="h-10 w-10 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h3 className="font-semibold text-gray-900">
            {teamLeader.first_name} {teamLeader.last_name}
          </h3>
          <p className="text-sm text-gray-600">Team Leader</p>
        </div>
      </div>

      {/* Team Members */}
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700">Team Members:</p>
        <div className="flex -space-x-2 mt-2">
          {teamMembers.map((member, index) => (
            <img
              key={index}
              src={member.image_url || "/assets/placeholder-avatar.png"}
              alt={`${member.first_name}'s avatar`}
              className="h-8 w-8 rounded-full border border-white dark:border-gray-800"
            />
          ))}
        </div>
      </div>

      {/* Button */}
      <Button variant="hollow" size="sm" className="mt-4 text-blue-600 border-blue-600 hover:bg-blue-50">
        Mentors
      </Button>
    </div>
  );
}