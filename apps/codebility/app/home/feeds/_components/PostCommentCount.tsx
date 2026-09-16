import { MessageSquare } from "lucide-react";

import type { PostType } from "@/types/feeds";

interface PostCommentCountProps {
  post: PostType;
}

export default function PostCommentCount({ post }: PostCommentCountProps) {
  // Rendered straight from the prop: the previous version mirrored it into
  // state via an effect keyed on `post`, which re-ran on every store write.
  return (
    <div className="flex items-center space-x-1">
      <MessageSquare size={20} className="text-gray-600 dark:text-gray-400" />
      <span>{post.comment_count ?? 0}</span>
    </div>
  );
}
