"use client";

import { Star, StarHalf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const RatingDisplay = ({ ratingStats, ratings = [] }) => {
  const { averageRating, totalRatings, ratingDistribution } = ratingStats;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  const getRatingPercentage = (rating) => {
    if (totalRatings === 0) return 0;
    return Math.round((ratingDistribution[rating] / totalRatings) * 100);
  };

  return (
    <Card className="border-emerald-900/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          Ratings & Reviews
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{averageRating}</div>
            <div className="text-sm text-muted-foreground">out of 5</div>
          </div>
          <div className="flex items-center gap-1">
            {renderStars(averageRating)}
          </div>
          <div className="text-sm text-muted-foreground">
            {totalRatings} {totalRatings === 1 ? "rating" : "ratings"}
          </div>
        </div>

        {totalRatings > 0 && (
          <>
            <Separator className="bg-emerald-900/20" />

            {/* Rating Distribution */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">Rating Breakdown</h4>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 min-w-[60px]">
                    <span className="text-sm text-muted-foreground">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${getRatingPercentage(rating)}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground min-w-[40px]">
                    {ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Recent Reviews */}
        {ratings.length > 0 && (
          <>
            <Separator className="bg-emerald-900/20" />
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white">Recent Reviews</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {ratings.slice(0, 5).map((rating) => (
                  <div key={rating.id} className="border border-emerald-900/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-900/20 flex items-center justify-center">
                          <span className="text-xs text-emerald-400 font-medium">
                            {rating.patient.name?.charAt(0) || "P"}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-white">
                          {rating.patient.name || "Anonymous"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(rating.rating)}
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-muted-foreground">
                        {rating.comment}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {totalRatings === 0 && (
          <div className="text-center py-6">
            <Star className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No ratings yet. Be the first to rate this doctor!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingDisplay;

