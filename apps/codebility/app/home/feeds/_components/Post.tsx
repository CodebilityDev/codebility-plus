import Image from "next/image";

interface PostProps {
  user: string;
  userImage: string;
  content: string;
  timestamp: string;
  images?: string[];
  reactions: {
    likes: number;
    comments: number;
  };
}

export default function Post({
  user,
  userImage,
  content,
  timestamp,
  images = [],
  reactions,
}: PostProps) {
  return (
    <div className="dark:text-black-800 border-b bg-white p-4 shadow-lg ">
      {/* Header */}
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

      {/* Content */}
      <p className="mt-2 text-gray-700 dark:text-gray-300">{content}</p>

      {/* Images */}
      {images.length > 0 && (
        <div className={`mt-4 grid gap-2 ${getGridClass(images.length)}`}>
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-48 w-full overflow-hidden rounded-lg"
            >
              <Image
                src={image}
                alt={`Post image ${index + 1}`}
                className="object-cover"
                fill
              />
            </div>
          ))}
        </div>
      )}

      {/* Reactions */}
      <div className="mt-4 flex items-center space-x-4 text-gray-600 dark:text-gray-400">
        <button className="flex items-center space-x-1 hover:text-blue-500 dark:hover:text-blue-400">
          <span>❤️</span>
          <span>{reactions.likes}</span>
        </button>
        {/* <button className="flex items-center space-x-1 hover:text-blue-500 dark:hover:text-blue-400">
          <span>💬</span>
          <span>{reactions.comments}</span>
        </button> */}
        {/* optional */}
      </div>
    </div>
  );
}

/**
 * Returns the appropriate Tailwind grid class based on the number of images.
 */
function getGridClass(imageCount: number): string {
  switch (imageCount) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-3";
    case 4:
      return "grid-cols-2";
    default:
      return "";
  }
}
