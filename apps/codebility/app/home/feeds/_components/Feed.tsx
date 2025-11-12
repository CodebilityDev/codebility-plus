"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFeedsStore } from "@/store/feeds-store";

import Post from "./PostCard";

interface FeedProp {
  isAdmin: boolean;
  searchQuery?: string;
}

export default function Feed({ isAdmin, searchQuery }: FeedProp) {
  const posts = useFeedsStore((state) => state.posts);
  const fetchPosts = useFeedsStore((state) => state.fetchPosts);

  const [visibleCount, setVisibleCount] = useState(6);
  const loaderRef = useRef<HTMLDivElement | null>(null);

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

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(6);
  }, [searchQuery]);

  // Infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setVisibleCount((prev) => {
            if (prev < filteredPosts.length) {
              return Math.min(prev + 6, filteredPosts.length);
            }
            return prev;
          });
        }
      },
      { threshold: 1 },
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [filteredPosts.length]);

  const handleDeletePost = (deletedPostId: string | number) => {
    useFeedsStore.setState((state) => ({
      posts: state.posts.filter((post) => post.id !== deletedPostId),
    }));
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {visiblePosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            isAdmin={isAdmin}
            onDelete={handleDeletePost}
          />
        ))}
      </div>

      {/* Loader / sentinel div for infinite scroll */}
      {visibleCount < filteredPosts.length && (
        <div
          ref={loaderRef}
          className="mt-6 flex justify-center text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            Loading more posts...
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredPosts.length === 0 && (
        <div className="mt-8 text-center text-gray-500">No posts found.</div>
      )}
    </>
  );
}
