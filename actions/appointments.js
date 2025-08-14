"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, endOfDay, format, isBefore } from "date-fns";
import { deductCreditsForAppointment } from "@/actions/credits";
import { revalidatePath } from "next/cache";
import { Auth } from "@vonage/auth";
import { Vonage } from "@vonage/server-sdk";

const credentials = new Auth({
  applicationId: process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID,
  privateKey: process.env.VONAGE_PRIVATE_KEY,
});

const vonage = new Vonage(credentials, {});

export async function getDoctorById(doctorId) {
  try {
    const doctor = await db.user.findFirst({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    return { doctor };
  } catch (error) {
    throw new Error("Failed to fetch doctor details");
  }
}

export async function getAvailableTimeSlots(doctorId) {
  try {
    const doctor = await db.user.findFirst({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const availability = await db.availability.findFirst({
      where: {
        doctorId: doctor.id,
        status: "AVAILABLE",
      },
    });

    // if (!availability) {
    //   throw new Error("No availability set by doctor");
    // }
    if (!availability) {
  return { days: [] }; // Return empty days instead of throwing
}

    const now = new Date();
    const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];

    const lastDay = endOfDay(days[3]);
    const existingAppointments = await db.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: "SCHEDULED",
        startTime: {
          lte: lastDay,
        },
      },
    });

    const availableSlotsByDay = {};

    // Base availability clock times and whether it spans midnight
    const baseStart = new Date(availability.startTime);
    const baseEnd = new Date(availability.endTime);
    const startH = baseStart.getHours();
    const startM = baseStart.getMinutes();
    const endH = baseEnd.getHours();
    const endM = baseEnd.getMinutes();
    const spansMidnight = endH < startH || (endH === startH && endM <= startM);

    const withTime = (dayLike, h, m) => {
      const d = new Date(dayLike);
      d.setHours(h, m, 0, 0);
      return d;
    };

    const pushSlotsInRange = (rangeStart, rangeEnd) => {
      let current = new Date(rangeStart);
      const end = new Date(rangeEnd);

      while (
        isBefore(addMinutes(current, 30), end) ||
        +addMinutes(current, 30) === +end
      ) {
        const next = addMinutes(current, 30);

        if (isBefore(current, now)) {
          current = next;
          continue;
        }

        const overlaps = existingAppointments.some((appointment) => {
          const aStart = new Date(appointment.startTime);
          const aEnd = new Date(appointment.endTime);

          return (
            (current >= aStart && current < aEnd) ||
            (next > aStart && next <= aEnd) ||
            (current <= aStart && next >= aEnd)
          );
        });

        if (!overlaps) {
          const dayKey = format(current, "yyyy-MM-dd");
          if (!availableSlotsByDay[dayKey]) availableSlotsByDay[dayKey] = [];
          availableSlotsByDay[dayKey].push({
            startTime: current.toISOString(),
            endTime: next.toISOString(),
            formatted: `${format(current, "h:mm a")} - ${format(
              next,
              "h:mm a"
            )}`,
            day: format(current, "EEEE, MMMM d"),
          });
        }
        current = next;
      }
    };

    for (const day of days) {
      const dayString = format(day, "yyyy-MM-dd");
      availableSlotsByDay[dayString] = [];

      if (!spansMidnight) {
        const availabilityStart = withTime(day, startH, startM);
        const availabilityEnd = withTime(day, endH, endM);
        pushSlotsInRange(availabilityStart, availabilityEnd);
      } else {
        // Evening segment (today from start time until midnight)
        const eveningStart = withTime(day, startH, startM);
        const eveningEnd = endOfDay(day);
        pushSlotsInRange(eveningStart, eveningEnd);

        // Morning segment (today from midnight until end time)
        const morningStart = withTime(day, 0, 0);
        const morningEnd = withTime(day, endH, endM);
        pushSlotsInRange(morningStart, morningEnd);
      }
    }

    // convert to array of  slots grouped by day for easier consumption by UI
    const result = Object.entries(availableSlotsByDay).map(([date, slots]) => ({
      date,
      displayDate:
        slots.length > 0
          ? slots[0].day
          : format(new Date(date), "EEEE, MMMM d"),
      slots,
    }));

    return { days: result };
  } catch (error) {
     console.error("Actual error fetching doctor details:", error);
    throw new Error("Failed to fetch doctor details");
  }
}

export async function bookAppointment(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    //get the patient user
    const patient = await db.user.findUnique({
      where: {
        clerkUserId: userId,
        role: "PATIENT",
      },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    //Parse form data
    const doctorId = formData.get("doctorId");
    const startTime = new Date(formData.get("startTime"));
    const endTime = new Date(formData.get("endTime"));
    const patientDescription = formData.get("description") || null;

    if (!doctorId || !startTime || !endTime) {
      throw new Error("Doctor, start time, and end time are required");
    }

    const doctor = await db.user.findUnique({
      where: {
        id: doctorId,
        role: "DOCTOR",
        verificationStatus: "VERIFIED",
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found or not verified");
    }

    if (patient.credits < 2) {
      throw new Error("Insufficient credits to book an appointment");
    }

    const overlappingAppointment = await db.appointment.findFirst({
      where: {
        doctorId: doctorId,
        status: "SCHEDULED",
        OR: [
          {
            startTime: {
              lte: startTime,
            },
            endTime: {
              gt: startTime,
            },
          },

          {
            startTime: {
              lt: endTime,
            },
            endTime: {
              gte: endTime,
            },
          },
        ],
      },
    });

    if (overlappingAppointment) {
      throw new Error("This time slot is already booked");
    }

    const sessionId = await createVideoSession();

    
      const { success, error } = await deductCreditsForAppointment(
        patient.id,
        doctor.id
        
      );

      if (!success) {
        throw new Error(error || "Failed to deduct credits");
      }

      const appointment = await db.appointment.create({
        data: {
          patientId: patient.id,
          doctorId: doctor.id,
          startTime,
          endTime,
          patientDescription,
          status: "SCHEDULED",
          videoSessionId: sessionId,
        },
      });
     // return appointment;
    //});
    revalidatePath("/appointments");
    return { success: true, appointment: appointment };
  } catch (error) {
    throw new Error("Failed to book appointment:" + error.message);
  }
}

async function createVideoSession() {

    try{
       const session = await vonage.video.createSession({mediaMode: "routed"});
       return session.sessionId;
    } catch (error) {
       
       throw new Error("Failed to create video session" + error.message);
    }
}

export async function generateVideoToken(formData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const appointmentId = formData.get("appointmentId");

    const appointment = await db.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
      throw new Error("You are not authorized to join this call");
    }

    if (appointment.status !== "SCHEDULED") {
      throw new Error("Appointment is not scheduled");
    }

    const now = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const timeDifference = (appointmentTime - now) / (1000 * 60); 

    if (timeDifference > 30) {
      throw new Error("You can only join the call 30 minutes before the appointment");
    }

    const appointmentEndTime = new Date(appointment.endTime);
    const expirationTime = Math.floor
      (appointmentEndTime.getTime() - now.getTime() / 1000) + 60 * 60;

      const connectionData = JSON.stringify({
        name: user.name,
        role: user.role,
        userId: user.id,
      });

      const token = vonage.video.generateClientToken(appointment.videoSessionId, {
        role: "publisher",
        expireTime: expirationTime,
        data: connectionData,
      }
      );

      await db.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          videoSessionToken: token,
        },
      });

      return {
        success: true,
        videoSessionId: appointment.videoSessionId,
        token: token,
      };
  } catch (error) {
    throw new Error("Failed to generate video token:" + error.message);
  
  }
}

