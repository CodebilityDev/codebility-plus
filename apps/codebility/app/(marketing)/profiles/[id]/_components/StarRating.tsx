"use client";

import { Star, StarHalf } from "lucide-react";
import React from "react";

interface StarRatingProps {
  rating: number; 
  maxStars?: number;
  size?: number; 
}

export default function StarRating({ rating, maxStars = 5, size = 20 }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="star-rating relative flex">
      {/* Empty Stars */}
      <div className="stars flex gap-1">
        {Array.from({ length: maxStars }).map((_, i) => (
          <Star key={i} fill="none" stroke="yellow" strokeWidth={2} size={size} />
        ))}
      </div>

      {/* Filled Stars */}
      <div className="stars rating absolute top-0 left-0 flex gap-1 overflow-hidden"
           style={{ width: `${(fullStars + (hasHalfStar ? 0.5 : 0)) / maxStars * 100}%` }}
      >
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} fill="yellow" strokeWidth={0} size={size} />
        ))}
        {hasHalfStar && <StarHalf key="half" fill="yellow" strokeWidth={0} size={size} />}
      </div>
    </div>
  );
}