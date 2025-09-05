import { Codev } from "@/types/home/codev";
import { MemberStats } from "../_types/in-house";

export const statusColors: Record<string, string> = {
  Available: "text-codeGreen",
  Deployed: "text-codeYellow",
  Training: "text-codeBlue",
  Vacation: "text-codePurple",
  Busy: "text-codeRed",
  "Client Ready": "text-white", // no tailwindconfig color
  Blocked: "text-white", // no tailwindconfig color
  Graduated: "text-white", // no tailwindconfig color
};

//clean data example BE has "AVAILABLE" to "Available"
// export const convertToTitleCase = (word: string) => {
//   return word
//     .toLowerCase()
//     .split(" ")
//     .map((letter) => letter.charAt(0).toUpperCase() + letter.slice(1))
//     .join(" ");
// };

//altered to handle undefined or null values for storybook error handling
export const convertToTitleCase = (word: string | undefined | null) => {
  if (!word) return "";
  return word
    .toLowerCase()
    .split("_")
    .map((letter) => letter.charAt(0).toUpperCase() + letter.slice(1))
    .join(" ");
};

export function getMemberStats(data: Codev[]): MemberStats {
  return data.reduce(
    (acc, codev) => {
      if (codev.availability_status === true) acc.active += 1;
      else if (codev.availability_status === false) acc.inactive += 1;

      return acc;
    },
    { total: data.length, active: 0, inactive: 0 },
  );
}
