import { useEffect, useState } from "react";
import { useFeedsStore } from "@/store/feeds-store";
import { MessageSquare } from "lucide-react";

import { PostType } from "../_services/query";

interface PostCommentCountProps {
  post: PostType;
}

export default function PostCommentCount({ post }: PostCommentCountProps) {
  const [count, setCount] = useState(post.comment_count ?? 0);

  // Update local state whenever the post prop changes
  useEffect(() => {
    setCount(post.comment_count ?? 0);
  }, [post]);

  return (
    <div className="flex items-center space-x-1">
      <MessageSquare size={20} className="text-gray-600 dark:text-gray-400" />
      <span>{count}</span>
    </div>
  );
}
