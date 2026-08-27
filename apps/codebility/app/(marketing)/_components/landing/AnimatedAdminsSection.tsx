"use client";

import { Codev } from "@/types/home/codev";

import AdminCard from "./LandingAdminCard";
import BlueBg from "./LandingBlueBg";
import ProgressiveMotion from "./ProgressiveMotion";

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
  sectionId,
}: AnimatedAdminsSectionProps) => {
  return (
    <div data-section={sectionId} className="w-full">
    <ProgressiveMotion
      className="w-full"
      y={24}
      duration={0.55}
      staggerChildren={0.08}
    >
      <h1
        data-progressive-child
        className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-center text-3xl font-bold text-transparent"
      >
        {title}
      </h1>

      <div className="flex flex-col items-center justify-center">
        <div className="max-w-[1100px] px-4">
          <p
            data-progressive-child
            className="pt-8 text-center text-gray-300 md:px-44"
          >
            {description}
          </p>

          <div>
            <BlueBg className="h-[300px] w-full max-w-[1200px] lg:top-[45%]" />
          </div>

          <div className="grid grid-cols-2 gap-2 pb-5 pt-20 md:grid-cols-4">
            {members.map((member: Codev) => (
              <div
                key={member.id}
                data-progressive-child
                className="relative h-full"
              >
                <AdminCard admin={member} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProgressiveMotion>
    </div>
  );
};

export default AnimatedAdminsSection;
