"use client";

import { useState, useEffect } from "react";
import { Star, User, Stethoscope, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { getAllRatings } from "@/actions/ratings";

const RatingsManagement = () => {
  const [ratings, setRatings] = useState([]);
  const [filteredRatings, setFilteredRatings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const {
    loading: fetchLoading,
    fn: fetchRatings,
    data: ratingsData,
  } = useFetch(getAllRatings);

  useEffect(() => {
    fetchRatings();
  }, []);

  useEffect(() => {
    if (ratingsData?.ratings) {
      setRatings(ratingsData.ratings);
      setFilteredRatings(ratingsData.ratings);
    }
  }, [ratingsData]);

  useEffect(() => {
    let filtered = [...ratings];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (rating) =>
          rating.patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rating.doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rating.doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by rating
    if (filterRating !== "all") {
      const ratingValue = parseInt(filterRating);
      filtered = filtered.filter((rating) => rating.rating === ratingValue);
    }

    // Sort ratings
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "highest") {
        return b.rating - a.rating;
      } else if (sortBy === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    setFilteredRatings(filtered);
  }, [ratings, searchTerm, filterRating, sortBy]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const getRatingLabel = (rating) => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Unknown";
    }
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 1: return "bg-red-900/20 border-red-900/30 text-red-400";
      case 2: return "bg-orange-900/20 border-orange-900/30 text-orange-400";
      case 3: return "bg-yellow-900/20 border-yellow-900/30 text-yellow-400";
      case 4: return "bg-blue-900/20 border-blue-900/30 text-blue-400";
      case 5: return "bg-emerald-900/20 border-emerald-900/30 text-emerald-400";
      default: return "bg-gray-900/20 border-gray-900/30 text-gray-400";
    }
  };

  if (fetchLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading ratings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-emerald-900/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Ratings Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-medium text-white">
                Search
              </Label>
              <Input
                id="search"
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-emerald-900/30 bg-muted/20 text-white placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating-filter" className="text-sm font-medium text-white">
                Rating Filter
              </Label>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="border-emerald-900/30 bg-muted/20 text-white">
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  <SelectItem value="5">5 stars</SelectItem>
                  <SelectItem value="4">4 stars</SelectItem>
                  <SelectItem value="3">3 stars</SelectItem>
                  <SelectItem value="2">2 stars</SelectItem>
                  <SelectItem value="1">1 star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort" className="text-sm font-medium text-white">
                Sort By
              </Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-emerald-900/30 bg-muted/20 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="highest">Highest rating</SelectItem>
                  <SelectItem value="lowest">Lowest rating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-white">
                Total Ratings
              </Label>
              <div className="text-2xl font-bold text-white">
                {filteredRatings.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredRatings.length === 0 ? (
        <div className="text-center py-12">
          <Star className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-xl font-medium text-white mb-2">
            No ratings found
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || filterRating !== "all"
              ? "Try adjusting your search or filter criteria."
              : "There are no ratings in the system yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRatings.map((rating) => (
            <Card key={rating.id} className="border-emerald-900/20">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Rating Header */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {renderStars(rating.rating)}
                      </div>
                      <Badge
                        variant="outline"
                        className={getRatingColor(rating.rating)}
                      >
                        {getRatingLabel(rating.rating)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Patient and Doctor Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-emerald-400" />
                        <div>
                          <p className="text-sm font-medium text-white">
                            {rating.patient.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {rating.patient.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-emerald-400" />
                        <div>
                          <p className="text-sm font-medium text-white">
                            Dr. {rating.doctor.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {rating.doctor.specialty}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Comment */}
                    {rating.comment && (
                      <div className="p-3 rounded-md bg-muted/20 border border-emerald-900/20">
                        <p className="text-sm text-white">{rating.comment}</p>
                      </div>
                    )}

                    {/* Appointment Info */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Appointment: {new Date(rating.appointment.startTime).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RatingsManagement;

