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
  if (!word) return '';
  return word
    .toLowerCase()
    .split("_")
    .map((letter) => letter.charAt(0).toUpperCase() + letter.slice(1))
    .join(" ");
};