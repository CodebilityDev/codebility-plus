"use client";

export const TechBadge = ({ name, className }: { name: string; className: string }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-all hover:opacity-90 ${className}`}
    >
      {name}
    </span>
  );
};
