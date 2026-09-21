export const badgePrefixFor = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes("frontend")) return "fe";
  if (lower.includes("backend")) return "be";
  if (lower.includes("mobile")) return "md";
  if (lower.includes("ui") || lower.includes("ux")) return "uiux";
  return name.substring(0, 2).toLowerCase();
};
