import { Box } from "@/Components/shared/dashboard";

import CreatePost from "./_components/CreatePost";
import Feed from "./_components/Feed";

export default function FeedsPage() {
  return (
    <>
      <div className="text-black-800 dark:text-white">
        <h1 className="text-3xl font-bold">Feeds</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay updated with the latest announcements and discussions from the
          Codebility community.
        </p>
      </div>
      <Box className="text-black-800 min-h-screen dark:text-white">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6"></div>
          <Feed />
        </div>
      </Box>
    </>
  );
}
