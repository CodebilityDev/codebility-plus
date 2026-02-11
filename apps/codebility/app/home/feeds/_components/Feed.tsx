"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFeedsStore } from "@/store/feeds-store";

import { POSTS_PER_PAGE } from "../_constants";
import { SYSTEM_POST } from "../_constants/system-post";
import Post from "./PostCard";
import PostCardSkeleton from "./PostCardSkeleton";

interface FeedProp {
  isAdmin: boolean;
  searchQuery?: string;
  sortField: "title" | "date" | "upvotes" | "comments";
  sortOrder: "asc" | "desc";
}

export default function Feed({
  isAdmin,
  searchQuery,
  sortField,
  sortOrder,
}: FeedProp) {
  const posts = useFeedsStore((state) => state.posts);
  const fetchPosts = useFeedsStore((state) => state.fetchPosts);
  const isFetchingPosts = useFeedsStore((state) => state.isFetchingPosts);

  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Always prepend system post to regular posts
  const allPosts = useMemo(() => {
    return [SYSTEM_POST, ...posts];
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") return allPosts;
    
    const query = searchQuery.toLowerCase();
    return allPosts.filter((post) => {
      // Always include system post
      if (post.id === "00000000-0000-0000-0000-000000000001") return true;
      
      const titleMatch = post.title?.toLowerCase().includes(query);
      const firstNameMatch = post.author_id?.first_name
        ?.toLowerCase()
        .includes(query);
      const lastNameMatch = post.author_id?.last_name
        ?.toLowerCase()
        .includes(query);
      return titleMatch || firstNameMatch || lastNameMatch;
    });
  }, [allPosts, searchQuery]);

  // Sort posts
  const sortedPosts = useMemo(() => {
    const sorted = [...filteredPosts];
    sorted.sort((a, b) => {
      // Always keep system post at the top regardless of sorting
      if (a.id === "00000000-0000-0000-0000-000000000001") return -1;
      if (b.id === "00000000-0000-0000-0000-000000000001") return 1;

      let aVal: string | number = "";
      let bVal: string | number = "";

      switch (sortField) {
        case "title":
          aVal = a.title?.toLowerCase() || "";
          bVal = b.title?.toLowerCase() || "";
          break;
        case "date":
          aVal = new Date(a.created_at).getTime();
          bVal = new Date(b.created_at).getTime();
          break;
        case "upvotes":
          aVal = a.upvote_count ?? 0;
          bVal = b.upvote_count ?? 0;
          break;
        case "comments":
          aVal = a.comment_count ?? 0;
          bVal = b.comment_count ?? 0;
          break;
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredPosts, sortField, sortOrder]);

  const visiblePosts = sortedPosts.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [searchQuery]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + POSTS_PER_PAGE, sortedPosts.length),
          );
        }
      },
      { threshold: 1 },
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);
    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [sortedPosts.length]);

  const handleDeletePost = (deletedPostId: string | number) => {
    // Prevent deletion of system post
    if (deletedPostId === "00000000-0000-0000-0000-000000000001") return;
    
    useFeedsStore.setState((state) => ({
      posts: state.posts.filter((post) => post.id !== deletedPostId),
    }));
  };

  return (
    <>
      {/* Posts grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {isFetchingPosts
          ? Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))
          : visiblePosts.map((post) => (
              <Post
                key={post.id}
                post={post}
                isAdmin={isAdmin}
                onDelete={handleDeletePost}
              />
            ))}
      </div>

      {/* Loader */}
      {!isFetchingPosts && visibleCount < sortedPosts.length && (
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
      {!isFetchingPosts && sortedPosts.length === 0 && (
        <div className="mt-8 text-center text-gray-500">No posts found.</div>
      )}
    </>
  );
}