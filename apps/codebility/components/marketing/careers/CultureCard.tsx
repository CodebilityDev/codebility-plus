"use client";
import type { CultureCardProps } from "@/types/marketing/careers/careers";

export const CultureCard = ({
  item,
}: CultureCardProps) => {
  const Icon = item.icon;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gray-600 hover:bg-gray-900/70">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className={`mb-4 inline-flex rounded-lg p-3 ${item.iconBg}`}>
          <Icon className={`h-6 w-6 ${item.iconColor}`} />
        </div>

        <h3 className="mb-3 text-lg font-semibold text-white">{item.title}</h3>

        <p className="text-sm leading-relaxed text-gray-300">{item.description}</p>
      </div>
    </div>
  );
};
