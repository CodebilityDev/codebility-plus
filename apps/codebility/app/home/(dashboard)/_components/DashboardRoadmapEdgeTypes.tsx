import { BaseEdge, EdgeProps, getBezierPath } from "reactflow";

export const CustomRoadmapEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isActive = data?.isActive ?? false;

  return (
    <>
      {/* Background path for glow effect */}
      {isActive && (
        <path
          d={edgePath}
          fill="none"
          stroke="url(#gradient-glow)"
          strokeWidth={6}
          className="opacity-40"
        />
      )}

      {/* Main path */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: isActive ? "url(#gradient-edge)" : "#9ca3af",
          strokeWidth: isActive ? 4 : 2,
          strokeDasharray: isActive ? undefined : "5,5",
        }}
      />

      {/* Animated dots along the path when active */}
      {isActive && (
        <circle r="4" fill="#8b5cf6" className="animate-pulse">
          <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}

      {/* Define gradients for edges */}
      <defs>
        <linearGradient id="gradient-edge" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="gradient-glow" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
    </>
  );
};
