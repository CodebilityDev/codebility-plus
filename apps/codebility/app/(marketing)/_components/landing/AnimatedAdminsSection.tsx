import { Codev } from "@/types/home/codev";
import AdminCard from "./LandingAdminCard";
import BlueBg from "./LandingBlueBg";

interface AnimatedAdminsSectionProps {
  title: string;
  description: string;
  members: Codev[];
  sectionId: string;
}

const AnimatedAdminsSection = ({ 
  title, 
  description, 
  members, 
  sectionId 
}: AnimatedAdminsSectionProps) => {
  return (
    <div className="w-full">
      <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
        {title}
      </h1>
      
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-[1100px] px-4">
          <p className="pt-8 text-center md:px-44 text-gray-300">
            {description}
          </p>
          
          <div>
            <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 pb-5 pt-20 md:grid-cols-4">
            {members.map((member: Codev, index: number) => (
              <div key={member.id} className="h-full relative">
                <AdminCard
                  admin={member}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedAdminsSection;