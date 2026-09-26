"use client";

export const ProfileCompletionGuideBadge = ({
  children,
  variant,
  className,
}: {
  children?: React.ReactNode;
  variant?: "secondary" | "outline" | "success" | "warning";
  className?: string;
}) => {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const variants: Record<string, string> = {
    secondary: "bg-gray-700 text-gray-200",
    outline: "border border-gray-600 text-gray-300",
    success: "bg-green-500/20 text-green-400 border border-green-500/30",
    warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  };
  const variantClass = variant ? variants[variant] ?? "" : "";
  return (
    <span className={`${base} ${variantClass} ${className ?? ""}`.trim()}>
      {children}
    </span>
  );
};
