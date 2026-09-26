// Helper function to get badge prefix from skill category name
export function getBadgePrefix(name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("frontend")) return "fe";
  if (lowerName.includes("backend")) return "be";
  if (lowerName.includes("mobile")) return "md";
  if (lowerName.includes("ui") || lowerName.includes("ux")) return "uiux";
  return name.substring(0, 2).toLowerCase();
}
