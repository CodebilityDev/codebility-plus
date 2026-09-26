import H1 from "@/components/shared/dashboard/H1";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-2 pt-4">
      <H1>Welcome to Codebility</H1>
      <p className="text-gray-600 dark:text-gray-400">
        The member dashboard is being rebuilt. New features will show up in the
        sidebar as they ship.
      </p>
    </div>
  );
}
