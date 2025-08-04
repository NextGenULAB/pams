import { redirect } from 'next/navigation';
import React from 'react'
import DoctorProfile from './_components/doctor-profile';
import { getAvailableTimeSlots, getDoctorById } from '@/actions/appointments';

const DoctorProfilePage = async ({ params }) => {
  const {id} = await params;

  try {
    const [doctorData, slotsData] = await Promise.all([
      getDoctorById(id),
      getAvailableTimeSlots(id),
    ]);

     return (
      <DoctorProfile
      doctor={doctorData.doctor}
      availableDays={slotsData.days || []}
      />
     );
    
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    redirect("/doctors");
  }
  
};

export default DoctorProfilePage;