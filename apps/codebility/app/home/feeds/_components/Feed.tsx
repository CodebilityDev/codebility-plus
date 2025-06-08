"use client";

import { useEffect, useState } from "react";
import DefaultPagination from "@/Components/ui/pagination";

import { getPosts, PostType } from "../_services/query";
import Post from "./Post";

export default function Feed({ isMentor }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<PostType[]>([]);

  const postsPerPage = 6;

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  useEffect(() => {
    async function fetchPosts() {
      const newPosts = await getPosts();
      setPosts(newPosts);
    }

    fetchPosts();
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {currentPosts.map((post) => (
          <Post post={post} isMentor={isMentor} />
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
