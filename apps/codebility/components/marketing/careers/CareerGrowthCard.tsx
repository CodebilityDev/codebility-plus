"use client";

import { careerPaths } from "@/constants/marketing/careers/careers";
import type { CareerPath } from "@/types/marketing/careers/careers";

export const CareerGrowthCard = ({
  path,
  index,
}: {
  path: CareerPath;
  index: number;
}) => {
  const Icon = path.icon;

  return (
    <div className="group relative">
      {index < careerPaths.length - 1 && (
        <div className="absolute -right-5 top-16 hidden h-0.5 w-10 bg-gradient-to-r from-gray-600 to-gray-400 lg:block" />
      )}

      <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-600 hover:bg-gray-900/70">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <div className={`rounded-lg p-3 ${path.iconBg}`}>
              <Icon className={`h-6 w-6 ${path.iconColor}`} />
            </div>
            <div>
              <span className={`text-sm font-medium ${path.iconColor}`}>
                {path.level}
              </span>
            </div>
          </div>

          <h3 className="mb-3 text-xl font-semibold text-white">{path.title}</h3>
          <p className="mb-4 text-sm leading-relaxed text-gray-300">
            {path.description}
          </p>

          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-200">
              Growth Opportunities:
            </h4>
            <ul className="space-y-1">
              {path.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div
                    className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${path.dotColor}`}
                  />
                  <span className="text-xs text-gray-400">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
