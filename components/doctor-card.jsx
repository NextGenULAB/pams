import React from "react"
import { Card, CardContent } from "./ui/card";
import { Badge, Calendar, Star, User } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import RatingSummary from "./rating-summary";

const DoctorCard = ({ doctor }) => {
    return (
        <Card className="border-emerald-900/20 hover:border-emerald-700/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-900/50 h-full flex flex-col">
            <CardContent className="p-6 flex flex-col h-full">
                {/* Header Section - Fixed Height */}
                <div className="flex items-start gap-4 mb-4 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                        {doctor.imageUrl ? (
                            <img 
                                src={doctor.imageUrl}
                                alt={doctor.name}
                                className="w-16 h-16 rounded-full object-cover" 
                            />
                        ) : (
                            <User className="h-8 w-8 text-emerald-400"/>
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                            <h3 className="font-semibold text-white text-lg truncate">{doctor.name}</h3>
                            <Badge
                                variant="outline"
                                className="bg-emerald-900/20 border-emerald-900/30 text-emerald-400 self-start flex-shrink-0"
                            >
                                <Star className="h-3 w-3 mr-1" />
                                Verified
                            </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                            {doctor.specialty} • {doctor.experience} years experience
                        </p>

                        {/* Rating Display - Fixed Height */}
                        <div className="h-6 flex items-center">
                            <RatingSummary
                                averageRating={doctor.averageRating}
                                totalRatings={doctor.totalRatings}
                                size="sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Description Section - Flexible Height */}
                <div className="flex-1 mb-6">
                    <div className="text-sm text-muted-foreground line-clamp-3 min-h-[4.5rem]">
                        {doctor.description || "No description available"}
                    </div>
                </div>

                {/* Button Section - Fixed Height */}
                <div className="flex-shrink-0">
                    <Button
                        asChild
                        className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/25"
                    >
                        <Link href={`/doctors/${doctor.specialty}/${doctor.id}`}>
                            <Calendar className="h-4 w-4 mr-2" />
                            View Profile & Book
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default DoctorCard;