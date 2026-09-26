import { z } from "zod";

export const applicationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  linkedIn: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  portfolio: z
    .string()
    .url("Invalid portfolio URL")
    .optional()
    .or(z.literal("")),
  yearsOfExperience: z.string().min(1, "Years of experience is required"),
  coverLetter: z
    .string()
    .min(50, "Cover letter must be at least 50 characters"),
  experience: z.string().min(20, "Please describe your relevant experience"),
  referredBy: z.string().optional(),
  resume: z.any().optional(),
});

export function pageCacheKey(
  department: string,
  type: string,
  level: string,
  page: number,
  pageSize: number,
) {
  return `${department}:${type}:${level}:${page}:${pageSize}`;
}

export function filterCacheKey(
  department: string,
  type: string,
  level: string,
  pageSize: number,
) {
  return `${department}:${type}:${level}:${pageSize}`;
}

export function getLevelColor(level: string) {
  switch (level) {
    case "Entry":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "Mid":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Senior":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Lead":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
}

export function getTypeColor(type: string) {
  switch (type) {
    case "Full-time":
      return "bg-customTeal/10 text-customTeal border-customTeal/20";
    case "Part-time":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "Contract":
      return "bg-pink-500/10 text-pink-400 border-pink-500/20";
    case "Internship":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
}
