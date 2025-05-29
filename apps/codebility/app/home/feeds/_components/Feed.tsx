"use client";

import { useState } from "react";
import DefaultPagination from "@/Components/ui/pagination"; // Adjust the import path as needed

import Post from "./Post";
import { samplePosts } from "./SampleData";

export default function Feed() {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

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
    <div className="flex flex-col">
      {currentPosts.map((post) => (
        <Post
          key={post.id}
          user={post.user}
          userImage={post.userImage}
          content={post.content}
          timestamp={post.timestamp}
          images={post.images}
          reactions={post.reactions}
        />
      ))}

      <DefaultPagination
        totalPages={totalPages}
        currentPage={currentPage}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
