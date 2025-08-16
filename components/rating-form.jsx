"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { submitRating } from "@/actions/ratings";

const RatingForm = ({ appointment, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    loading: submitLoading,
    fn: submitRatingFn,
    data: submitData,
  } = useFetch(submitRating);

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (hoveredRating) => {
    setHoverRating(hoveredRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const formData = new FormData();
    formData.append("appointmentId", appointment.id);
    formData.append("rating", rating.toString());
    formData.append("comment", comment);

    await submitRatingFn(formData);
  };

  // Handle successful submission
  useEffect(() => {
    if (submitData?.success) {
      toast.success("Rating submitted successfully!");
      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    }
  }, [submitData, onRatingSubmitted]);

  // Don't render the form if submission was successful
  if (submitData?.success) {
    return null;
  }

  return (
    <Card className="border-emerald-900/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          Rate Your Experience
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">
              How would you rate your consultation with Dr. {appointment.doctor.name}?
            </Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => handleRatingHover(star)}
                  onMouseLeave={() => handleRatingHover(0)}
                  className="transition-colors duration-200"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              {rating === 0 && "Click to select a rating"}
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <Label htmlFor="comment" className="text-sm font-medium text-white">
              Additional Comments (Optional)
            </Label>
            <Textarea
              id="comment"
              placeholder="Share your experience, feedback, or suggestions..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px] border-emerald-900/30 bg-muted/20 text-white placeholder:text-muted-foreground"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitLoading || rating === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitLoading ? "Submitting..." : "Submit Rating"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RatingForm;
