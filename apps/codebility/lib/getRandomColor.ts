const getRandomColor = () => {
  const colors = [
    "bg-codeRed",
    "bg-codeBlue",
    "bg-codeGreen",
    "bg-codeYellow",
    "bg-codeViolet",
    "bg-codePurple",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default getRandomColor;
