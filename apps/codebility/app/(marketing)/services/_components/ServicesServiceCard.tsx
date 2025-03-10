import Image from "next/image";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Codev } from "@/types/home/codev";

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

interface ServiceProject {
  id: string;
  name: string;
  description?: string;
  main_image?: string;
  github_link?: string;
  figma_link?: string;
  start_date?: string;
  end_date?: string;
  team_leader?: TeamMember;
  members?: TeamMember[];
  project_category_id?: number;
  project_category_name?: string;
  client_id?: string;
  created_at?: string;
  updated_at?: string;
  website_url?: string;
}

interface Props {
  service: ServiceProject;
}

export default function ServiceCard({ service }: Props) {
  const { name, main_image, description, team_leader, members } = service;

  // Resolve the correct project image URL
  const imageUrl = main_image
    ? main_image.startsWith("public")
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/services-image/${main_image}`
      : main_image
    : "https://codebility-cdn.pages.dev/assets/images/default-avatar-1248x845.jpg";

  return (
    <div className="border-light-900/5 bg-light-700/10 flex h-full flex-1 flex-col gap-6 rounded-lg border-2 p-4 text-white">
      {/* Increased container height and gap */}
      <div
        className="relative h-48 w-full overflow-hidden rounded-lg"
        /*  style={{ aspectRatio: "21/9", minHeight: "400px" }} */
      >
        <Image
          src={imageUrl}
          alt={name}
          fill
          unoptimized={true}
          /* sizes="(min-width: 1024px) 960px, (min-width: 640px) 720px, 100vw" */
          className="absolute bg-center object-cover"
          priority
          quality={100}
        />
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <h3 className="line-clamp-1 text-lg font-medium lg:text-2xl">{name}</h3>
        <p className="text-gray  text-ellipsis text-sm">
          {description || "No description available."}
        </p>

        {/* Team Section */}
        <div className="mt-auto space-y-4">
          {/* Team Leader */}
          {team_leader && (
            <div>
              <p className="text-sm text-gray-400">Team Leader</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-gray-700">
                  {team_leader.image_url ? (
                    <Image
                      src={team_leader.image_url}
                      alt={`${team_leader.first_name} ${team_leader.last_name}`}
                      fill
                      unoptimized={true}
                      className="object-cover"
                    />
                  ) : (
                    <DefaultAvatar className="h-12 w-12" />
                  )}
                </div>
                <span className="text-base">
                  {team_leader.first_name} {team_leader.last_name}
                </span>
              </div>
            </div>
          )}
          {/* Team Members */}
          {members && members.length > 0 && (
            <div>
              <p className="mb-2 text-sm text-gray-400">Team Members</p>
              <div className="flex flex-wrap gap-2">
                {members.map((member) => (
                  <div key={member.id} className="group relative">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full ">
                      {member.image_url ? (
                        <div className="h-full w-full">
                          <Image
                            src={member.image_url}
                            alt={`${member.first_name} ${member.last_name}`}
                            width={48}
                            height={48}
                            unoptimized={true}
                            className="h-full w-full rounded-full object-cover"
                          />
                        </div>
                      ) : (
                        <DefaultAvatar size={48} className="h-full w-full" />
                      )}
                    </div>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
                      {member.first_name} {member.last_name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
