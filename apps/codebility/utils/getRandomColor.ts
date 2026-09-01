const COLORS = [
  "bg-codeRed",
  "bg-codeBlue",
  "bg-codeGreen",
  "bg-codeYellow",
  "bg-codeViolet",
  "bg-codePurple",
] as const;

export function getStableColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i)) | 0;
  }
  return COLORS[Math.abs(hash) % COLORS.length] ?? COLORS[0];
}

const getRandomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)] ?? COLORS[0];
};

export default getRandomColor;
