"use server";

import { db } from "@/lib/prisma";

export async function getDoctorsBySpecialty(specialty) {
  try {
    const doctors = await db.user.findMany({
      where: {
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
        specialty: specialty.split("%20").join(" "),
      },
      orderBy: {
        name: "asc",
      },
    });

    // Get rating statistics for each doctor
    const doctorsWithRatings = await Promise.all(
      doctors.map(async (doctor) => {
        const ratings = await db.rating.findMany({
          where: {
            doctorId: doctor.id,
          },
          select: {
            rating: true,
          },
        });

        let averageRating = 0;
        let totalRatings = 0;

        if (ratings.length > 0) {
          const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
          averageRating = Math.round((sum / ratings.length) * 10) / 10;
          totalRatings = ratings.length;
        }

        return {
          ...doctor,
          averageRating,
          totalRatings,
        };
      })
    );

    return { doctors: doctorsWithRatings };
  } catch (error) {
    console.error("Failed to fetch doctors by specialty:", error);
    return { error: "Failed to fetch doctors" };
  } 
}