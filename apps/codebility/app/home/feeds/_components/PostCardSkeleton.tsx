export default function PostCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-white/70 p-4 shadow-lg backdrop-blur-sm dark:bg-gray-800/70">
      {/* Image */}
      <div className="h-40 w-full rounded-md bg-gray-200 dark:bg-gray-700" />

      {/* Title */}
      <div className="mt-4 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

      {/* Subtitle */}
      <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />

      {/* Footer badges */}
      <div className="mt-4 flex gap-3">
        <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}
