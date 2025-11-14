import { Handle, NodeProps, Position } from "reactflow";

interface RoadmapNodeData {
  id: string;
  phase: string;
  title: string;
  pointsRange: string;
  steps: { id: string; step: string }[];
  isCompleted: boolean;
  isCurrent: boolean;
  isPending: boolean;
}

export const RoadmapPhaseCard = ({
  data: { id, phase, title, pointsRange, steps, isCompleted, isCurrent, isPending },
}: NodeProps<RoadmapNodeData>) => {
  return (
    <>
      <div
        className={`w-[380px] cursor-pointer rounded-xl border p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
          isCurrent
            ? "border-customBlue-400 bg-gradient-to-br from-customBlue-500/20 to-purple-500/20 dark:border-customBlue-500"
            : isCompleted
              ? "border-green-400/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:border-green-500/50"
              : "border-white/20 bg-white/10 opacity-60 dark:border-white/10"
        }`}
      >
        {/* Numbered Circle Badge */}
        <div
          className={`absolute -left-7 -top-7 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold shadow-lg ${
            isCurrent
              ? "bg-gradient-to-br from-customBlue-500 to-purple-500 text-white ring-4 ring-purple-300/50 dark:ring-purple-500/30"
              : isCompleted
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
          }`}
        >
          {isCurrent && (
            <div className="absolute -inset-1 animate-ping rounded-full bg-purple-400 opacity-75"></div>
          )}
          <span className="relative z-10">{id}</span>
        </div>

        {/* Status Icon Badge */}
        {isCompleted && (
          <div className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {isPending && (
          <div className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-gray-500 text-white shadow-lg dark:bg-gray-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}

        {/* Content */}
        <div className="mb-5 mt-2">
          <h3
            className={`mb-1 text-sm font-medium uppercase tracking-wider ${
              isCurrent
                ? "text-customBlue-600 dark:text-customBlue-400"
                : isCompleted
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-300 dark:text-gray-300"
            }`}
          >
            {phase}
          </h3>
          <h2
            className={`text-3xl font-bold ${
              isCurrent
                ? "bg-gradient-to-r from-customBlue-600 to-purple-600 bg-clip-text text-transparent"
                : isCompleted
                  ? "text-green-600 dark:text-green-400"
                  : "text-white dark:text-white"
            }`}
          >
            {title}
          </h2>
          <p
            className={`mt-1 text-sm font-semibold ${
              isCurrent
                ? "text-customBlue-600 dark:text-customBlue-400"
                : isCompleted
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-300 dark:text-gray-300"
            }`}
          >
            {pointsRange}
          </p>
        </div>

        {/* Steps List */}
        <ul className="space-y-3">
          {steps.map((step) => (
            <li key={step.id} className="flex items-start gap-3">
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isCurrent
                    ? "bg-gradient-to-r from-customBlue-500 to-purple-500 text-white"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white dark:bg-gray-600 dark:text-white"
                }`}
              >
                0{step.id}
              </span>
              <p
                className={`flex-1 text-base leading-relaxed ${
                  isCurrent || isCompleted
                    ? "font-medium text-gray-800 dark:text-gray-100"
                    : "font-medium text-gray-200 dark:text-gray-200"
                }`}
              >
                {step.step}
              </p>
            </li>
          ))}
        </ul>

        {/* Current Phase Badge */}
        {isCurrent && (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-customBlue-500 to-purple-500 py-2.5 text-sm font-bold text-white shadow-lg">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            You are here!
          </div>
        )}
      </div>

      {/* Handles for connections */}
      <Handle type="source" position={Position.Top} id="top" className="opacity-0" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="opacity-0" />
      <Handle type="source" position={Position.Left} id="left" className="opacity-0" />
      <Handle type="source" position={Position.Right} id="right" className="opacity-0" />
      <Handle type="target" position={Position.Top} id="top" className="opacity-0" />
      <Handle type="target" position={Position.Bottom} id="bottom" className="opacity-0" />
      <Handle type="target" position={Position.Left} id="left" className="opacity-0" />
      <Handle type="target" position={Position.Right} id="right" className="opacity-0" />
    </>
  );
};

export const RoadmapDecorativeIcon = ({
  data: { icon, color },
}: NodeProps<{ icon: string; color: string }>) => {
  return (
    <div className={`text-6xl ${color} pointer-events-none select-none opacity-20`}>
      {icon}
    </div>
  );
};
