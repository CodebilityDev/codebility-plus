import React from "react";

interface CircularProgressBarProps {
  size: number;
  progress: number;
  strokeWidth: number;
  circleTwoStroke: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  size,
  progress,
  strokeWidth,
  circleTwoStroke,
}) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="circular-progress-bar">
      <circle
        stroke="transparent"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={center}
        cy={center}
      />
      <circle
        stroke={circleTwoStroke}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={center}
        cy={center}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 0.35s",
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
        }}
      />
    </svg>
  );
};

export default CircularProgressBar;
