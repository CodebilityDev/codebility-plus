import type { DayOfWeek } from "@/types/global/codev";
// ENter name here kung may bagong tech stack na idadagdag cause of issues with naming in database  -> svg filenames.
export const TECH_STACK_MAPPING: Record<string, string> = {
  // Multi-word names with spaces (need hyphens in filename)
  "github actions": "github-actions",
  "react native": "react-native",
  "spring boot": "springboot",
  "ruby on rails": "rails",
  "google cloud platform": "gcp",
  "microsoft azure": "azure",
  
  // Names with dots
  "asp.net core": "aspnet",
  "asp.net": "aspnet",
  "nuxt.js": "nuxtjs",
  "next.js": "nextjs",
  "node.js": "nodejs",
  "express.js": "expressjs",
  "vue.js": "vue",
  
  // Special characters
  "c++": "cplus-plus",
  "c#": "csharp",
  
  // Single word names that might have variations
  "reactnative": "react-native",
  "nextjs": "nextjs",
  "nodejs": "nodejs",
  "expressjs": "expressjs",
  "nuxtjs": "nuxtjs",
  "typescript": "typescript",
  "javascript": "javascript",
  "tailwind": "tailwind",
  "tailwindcss": "tailwind",
  "bootstrap": "bootstrap",
  "html": "html",
  "css": "css",
  "php": "php",
  "react": "react",
  "laravel": "laravel",
  "mui": "mui",
  "material-ui": "mui",
};

export const DEFAULT_START_TIME = "09:00";

export const DEFAULT_END_TIME = "17:00";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const WEEKDAYS: DayOfWeek[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];
