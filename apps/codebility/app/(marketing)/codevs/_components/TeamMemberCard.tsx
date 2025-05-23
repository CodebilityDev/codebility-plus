import Image from "next/image";

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  image_url?: string | null;
}

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-white dark:bg-dark200 rounded-lg shadow-sm p-4 flex flex-col items-center text-center transition-transform hover:scale-105">
      <div className="relative h-16 w-16 mb-3">
        {member.image_url ? (
          <Image
            src={member.image_url}
            alt={`${member.first_name} ${member.last_name}`}
            fill
            className="rounded-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 dark:bg-dark300 rounded-full flex items-center justify-center">
            ?
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-dark100_light900">
        {member.first_name} {member.last_name}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
      <button className="mt-4 px-4 py-2 border border-primary-500 text-primary-500 rounded-md hover:bg-primary-500 hover:text-white transition-colors">
        View Profile
      </button>
    </div>
  );
}