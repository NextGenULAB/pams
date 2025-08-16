"use client";

import { Star } from "lucide-react";

const RatingSummary = ({ averageRating, totalRatings, size = "sm" }) => {
  if (totalRatings === 0) {
    return null;
  }

  const starSize = size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5";
  const textSize = size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg";

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${starSize} ${
              i < Math.floor(averageRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className={`${textSize} text-muted-foreground`}>
        {averageRating} ({totalRatings})
      </span>
    </div>
  );
};

export default RatingSummary;

