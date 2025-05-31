import Image from "next/image";
import { Box } from "@/Components/shared/dashboard";
import { ArrowBigUp } from "lucide-react";

interface PostProps {
  user: string;
  userImage: string;
  content: string;
  timestamp: string;
  image: string;
  reactions: {
    likes: number;
  };
  postUrl: string;
}

export default function Post({
  user,
  userImage,
  content,
  timestamp,
  image,
  reactions,
  postUrl,
}: PostProps) {
  return (
    <Box className="group flex h-[350px] flex-col justify-between p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src={userImage}
            alt={`${user}'s profile`}
            className="mr-4 h-10 w-10 rounded-full object-cover"
            width={40}
            height={40}
          />
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100">
              {user}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {timestamp}
            </span>
          </div>
        </div>
        {/* Read Post Button */}
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black-300 invisible rounded-sm py-1 text-[10px] text-white hover:text-blue-700 group-hover:visible dark:bg-white dark:text-blue-400 dark:hover:text-blue-600"
        >
          Read Post
        </a>
      </div>
      {/* Content */}
      <div className="flex-grow">
        <p className="mt-2 line-clamp-2 text-gray-700 dark:text-gray-300">
          {content}
        </p>
      </div>
      {/* Image */}
      <div className="mt-4 h-40 w-full overflow-hidden rounded-sm">
        <img
          src={image}
          alt="Post image"
          className="h-40 w-full object-cover"
        />
      </div>
      {/* Reactions */}
      <div className="mt-4 flex items-center space-x-4 text-gray-600 dark:text-gray-400">
        <button className="flex items-center space-x-1 hover:text-blue-500 dark:hover:text-blue-400">
          <span>
            <ArrowBigUp />
          </span>
          <span>{reactions.likes}</span>
        </button>
      </div>
    </Box>
  );
}
