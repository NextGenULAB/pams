import { redirect } from 'next/navigation';
import React from 'react'
import DoctorProfile from './_components/doctor-profile';
import { getAvailableTimeSlots, getDoctorById } from '@/actions/appointments';
import { getDoctorRatings, getDoctorRatingStats } from '@/actions/ratings';
import { Card, CardContent } from '@/components/ui/card';
import { Stethoscope, Star, Calendar } from 'lucide-react';

const DoctorProfilePage = async ({ params }) => {
  const {id} = await params;

  try {
    const [doctorData, slotsData, ratingStats, ratings] = await Promise.all([
      getDoctorById(id),
      getAvailableTimeSlots(id),
      getDoctorRatingStats(id),
      getDoctorRatings(id),
    ]);

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            Doctor Profile
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Book your consultation with {doctorData.doctor?.name}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Doctor Profile Section */}
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <Card className="border-emerald-900/20 bg-muted/10">
                <CardContent className="p-6">
                  <DoctorProfile
                    doctor={doctorData.doctor}
                    availableDays={slotsData.days || []}
                    ratingStats={ratingStats}
                    ratings={ratings.ratings || []}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Quick Info Sidebar */}
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "600ms" }}>
              {/* Specialty Card */}
              <Card className="border-emerald-900/20 bg-emerald-950/10">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-900/20 flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {doctorData.doctor?.specialty}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {doctorData.doctor?.experience} years experience
                  </p>
                </CardContent>
              </Card>

              {/* Rating Card */}
              {ratingStats && (
                <Card className="border-emerald-900/20 bg-emerald-950/10">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-900/20 flex items-center justify-center mx-auto mb-4">
                      <Star className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {ratingStats.averageRating?.toFixed(1) || 'N/A'}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {ratingStats.totalRatings || 0} reviews
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Availability Card */}
              <Card className="border-emerald-900/20 bg-emerald-950/10">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-900/20 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Available Slots
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {slotsData.days?.length || 0} days available
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
    
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    redirect("/doctors");
  }
};

export default DoctorProfilePage;