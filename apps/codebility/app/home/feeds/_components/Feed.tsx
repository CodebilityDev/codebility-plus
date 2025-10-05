"use client";

import { useEffect, useState } from "react";
import DefaultPagination from "@/components/ui/pagination";
import { useFeedsStore } from "@/store/feeds-store"; // Adjust path as needed

import Post from "./Post";

interface FeedProp {
  isAdmin: boolean;
  onCreatePost?: () => void;
}

export default function Feed({ isAdmin }: FeedProp) {
  const posts = useFeedsStore((state) => state.posts);
  const fetchPosts = useFeedsStore((state) => state.fetchPosts);

  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 6;
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDeletePost = (deletedPostId: string | number) => {
    useFeedsStore.setState((state) => ({
      posts: state.posts.filter((post) => post.id !== deletedPostId),
    }));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {currentPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            isAdmin={isAdmin}
            onDelete={handleDeletePost}
          />
        ))}
      </div>
      <DefaultPagination
        totalPages={totalPages}
        currentPage={currentPage}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
