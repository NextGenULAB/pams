"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Submit a rating for a completed appointment
export async function submitRating(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const patient = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "PATIENT",
      },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    const appointmentId = formData.get("appointmentId");
    const rating = parseInt(formData.get("rating"));
    const comment = formData.get("comment");

    if (!appointmentId || !rating || rating < 1 || rating > 5) {
      throw new Error("Invalid rating data");
    }

    // Check if appointment exists and belongs to this patient
    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
        patientId: patient.id,
        status: "COMPLETED",
      },
      include: {
        doctor: true,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found or not completed");
    }

    // Check if rating already exists
    const existingRating = await db.rating.findUnique({
      where: {
        appointmentId,
      },
    });

    if (existingRating) {
      throw new Error("Rating already submitted for this appointment");
    }

    // Create the rating
    const newRating = await db.rating.create({
      data: {
        patientId: patient.id,
        doctorId: appointment.doctorId,
        appointmentId,
        rating,
        comment,
      },
    });

    revalidatePath(`/doctors/${appointment.doctor.specialty}/${appointment.doctorId}`);
    revalidatePath("/appointments");
    
    return { success: true, rating: newRating };
  } catch (error) {
    throw new Error("Failed to submit rating: " + error.message);
  }
}

// Get ratings for a specific doctor
export async function getDoctorRatings(doctorId) {
  try {
    const ratings = await db.rating.findMany({
      where: {
        doctorId,
      },
      include: {
        patient: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
        appointment: {
          select: {
            startTime: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { ratings };
  } catch (error) {
    throw new Error("Failed to fetch doctor ratings: " + error.message);
  }
}

// Get rating statistics for a doctor
export async function getDoctorRatingStats(doctorId) {
  try {
    const ratings = await db.rating.findMany({
      where: {
        doctorId,
      },
      select: {
        rating: true,
      },
    });

    if (ratings.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        }
      };
    }

    const totalRatings = ratings.length;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = Math.round((sum / totalRatings) * 10) / 10;

    const ratingDistribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };

    ratings.forEach(r => {
      ratingDistribution[r.rating]++;
    });

    return {
      averageRating,
      totalRatings,
      ratingDistribution,
    };
  } catch (error) {
    throw new Error("Failed to fetch rating statistics: " + error.message);
  }
}

// Check if a patient has already rated a specific appointment
export async function checkExistingRating(appointmentId) {
  const { userId } = await auth();

  if (!userId) {
    return { hasRated: false };
  }

  try {
    const patient = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "PATIENT",
      },
    });

    if (!patient) {
      return { hasRated: false };
    }

    const existingRating = await db.rating.findUnique({
      where: {
        appointmentId,
        patientId: patient.id,
      },
    });

    return { hasRated: !!existingRating };
  } catch (error) {
    return { hasRated: false };
  }
}

// Get all ratings for admin purposes
export async function getAllRatings() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const admin = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "ADMIN",
      },
    });

    if (!admin) {
      throw new Error("Admin access required");
    }

    const ratings = await db.rating.findMany({
      include: {
        patient: {
          select: {
            name: true,
            email: true,
          },
        },
        doctor: {
          select: {
            name: true,
            specialty: true,
          },
        },
        appointment: {
          select: {
            startTime: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { ratings };
  } catch (error) {
    throw new Error("Failed to fetch ratings: " + error.message);
  }
}

