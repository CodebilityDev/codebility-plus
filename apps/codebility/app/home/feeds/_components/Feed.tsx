"use client";

import { useEffect, useMemo, useState } from "react";
import DefaultPagination from "@/components/ui/pagination";
import { useFeedsStore } from "@/store/feeds-store";

import Post from "./PostCard";

interface FeedProp {
  isAdmin: boolean;
  searchQuery?: string;
}

export default function Feed({ isAdmin, searchQuery }: FeedProp) {
  const posts = useFeedsStore((state) => state.posts);
  const fetchPosts = useFeedsStore((state) => state.fetchPosts);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filter posts by title or author's first/last name (case-insensitive)
  const filteredPosts = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") return posts;

    const query = searchQuery.toLowerCase();

    return posts.filter((post) => {
      const titleMatch = post.title?.toLowerCase().includes(query);
      const firstNameMatch = post.author_id?.first_name
        ?.toLowerCase()
        .includes(query);
      const lastNameMatch = post.author_id?.last_name
        ?.toLowerCase()
        .includes(query);

      return titleMatch || firstNameMatch || lastNameMatch;
    });
  }, [posts, searchQuery]);

  const postsPerPage = 6;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage,
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

      {filteredPosts.length > 0 && (
        <DefaultPagination
          totalPages={totalPages}
          currentPage={currentPage}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
}
