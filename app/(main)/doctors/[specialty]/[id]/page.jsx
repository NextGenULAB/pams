import { redirect } from 'next/navigation';
import React from 'react'
import DoctorProfile from './_components/doctor-profile';
import { getAvailableTimeSlots, getDoctorById } from '@/actions/appointments';
import { getDoctorRatings, getDoctorRatingStats } from '@/actions/ratings';

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
      <DoctorProfile
      doctor={doctorData.doctor}
      availableDays={slotsData.days || []}
      ratingStats={ratingStats}
      ratings={ratings.ratings || []}
      />
     );
    
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    redirect("/doctors");
  }
  
};

export default DoctorProfilePage;