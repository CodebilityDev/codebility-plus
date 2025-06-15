import { useUserStore } from "@/store/codev-store";
import { ArrowBigUp } from "lucide-react";

import { PostType } from "../_services/query";

interface PostUpvoteProps {
  post: PostType;
}

export default function PostUpvote({ post }: PostUpvoteProps) {
  const { user } = useUserStore();

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // You can add upvote logic here
  };

  return (
    <button
      className="flex items-center space-x-1 hover:text-blue-500 dark:hover:text-blue-400"
      onClick={handleUpvote}
    >
      <ArrowBigUp />
      <span>{post.upvoters_id ? post.upvoters_id.length : 0}</span>
    </button>
  );
}
