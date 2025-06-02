"use client";

import { useState } from "react";
import DefaultPagination from "@/Components/ui/pagination";

import Post from "./Post";
import { samplePosts } from "./SampleData";

export default function Feed({ isMentor }) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const totalPages = Math.ceil(samplePosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = samplePosts.slice(startIndex, startIndex + postsPerPage);

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
          <Post
            key={post.id}
            user={post.user}
            userImage={post.userImage}
            content={post.content}
            timestamp={post.timestamp}
            image={post.image}
            reactions={post.reactions}
            postUrl={post.postUrl}
            isMentor={isMentor}
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
