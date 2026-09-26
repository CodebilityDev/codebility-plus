"use client";

import { TechBadge } from "@/components/marketing/careers/TechBadge";
import { techCategories } from "@/constants/marketing/careers/careers";

export const TechCategoryCard = ({
  category,
}: {
  category: (typeof techCategories)[0];
}) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-600 hover:bg-gray-900/70">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <h3 className="mb-4 text-lg font-semibold text-white">
          {category.category}
        </h3>

        <div className="flex flex-wrap gap-2">
          {category.technologies.map((tech) => (
            <TechBadge key={tech.name} name={tech.name} className={tech.className} />
          ))}
        </div>
      </div>
    </div>
  );
};
